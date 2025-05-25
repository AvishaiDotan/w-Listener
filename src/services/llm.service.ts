import { Anthropic } from "@anthropic-ai/sdk";

export abstract class LlmService {
    protected abstract client: any;

    abstract ask(prompt: string, options?: {
        model?: string;
        max_tokens?: number;
        system?: string;
    }): Promise<string>;
}

export class AnthropicLlm extends LlmService {
    protected client: Anthropic;
    public static instance: AnthropicLlm;

    private constructor() {
        super();
        this.ask = this.ask.bind(this);
        this.areMessagesInSameContext = this.areMessagesInSameContext.bind(this);
        this.summarizeMessages = this.summarizeMessages.bind(this);
    }

    public static getInstance(apiKey?: string): AnthropicLlm {
        if (AnthropicLlm.instance) {
            return AnthropicLlm.instance;
        } else {
            AnthropicLlm.instance = new AnthropicLlm();
            AnthropicLlm.instance.initiateClient(apiKey!);
            return AnthropicLlm.instance;
        }
    }

    private initiateClient(apiKey: string): this {
        this.client = new Anthropic({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
        });
        return this;
    }

    async ask(prompt: string, options?: {
        model?: string;
        max_tokens?: number;
        system?: string;
    }): Promise<string> {
        const response = await this.client.messages.create({
            model: options?.model || "claude-3-haiku-20240307",
            max_tokens: options?.max_tokens || 1024,
            messages: [
                { role: "user", content: prompt }
            ],
            system: options?.system,
        });
        // Anthropic SDK returns content as an array of blocks, find the text block
        const textBlock = response.content.find(block => block.type === "text");
        return (textBlock && "text" in textBlock) ? textBlock.text : "";
    }

    /**
     * Checks if all messages are in the same context using Anthropic API.
     * @param messages Array of objects: { date: string, text: string }
     * @returns Promise<boolean> - true if all messages are in the same context, false otherwise
     */
    public async areMessagesInSameContext(messages: Array<{ date: string, text: string }>): Promise<boolean> {
        const formattedMessages = messages.map((msg, idx) => `${idx + 1}. [${msg.date}] ${msg.text}`).join("\n");
        const prompt = `Given the following list of messages, answer ONLY true or false. Be VERY STRICT: if even one message is out of topic/context, return false.\n\nMessages:\n${formattedMessages}\n\nAre all messages in the same context? Answer ONLY true or false.`;
        const response = await this.ask(prompt, { max_tokens: 5 });
        const answer = response.trim().toLowerCase();
        return answer === "true";
    }

    /**
     * Summarizes an array of messages, focusing on the main idea and ignoring out-of-topic messages.
     * @param messages Array of objects: { date: string, text: string }
     * @returns Promise<string> - a concise summary of the main topic
     */
    public async summarizeMessages(messages: Array<{ date: string, text: string }>): Promise<string> {
        const formattedMessages = messages.map((msg, idx) => `${idx + 1}. [${msg.date}] ${msg.text}`).join("\n");
        const prompt = `Summarize the following messages in a concise way, focusing ONLY on the main idea or topic that most messages share. If some messages are out of topic, ignore them.\n\nMessages:\n${formattedMessages}\n\nSummary:`;
        const response = await this.ask(prompt, { max_tokens: 150 });
        return response.trim();
    }
}
