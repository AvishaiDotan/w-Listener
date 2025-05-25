import { IWhatsappWebEvent } from "./services/whatsappWeb.service";
import qrTerminal from 'qrcode-terminal'
import { MessageEventBuilderFactory } from "./lib/messageEventBuilder";
import { IMessage } from "./models/IMessage.type";
import { withTryCatchLogging } from "./helpers";
import { MongoDbService } from "./services/mongoDb.service";
import WAWebJS, { Client } from "whatsapp-web.js";
import { getLogger, ILogger } from "./services/logger.service";
import { AnthropicLlm } from "./services/llm.service";

const COLLECTION_NAME = process.env.MONGODB_DB_COLLECTION
const GROUP_NAME = 'C#mmunity'


export class WhatsappEventEnricher {
    private readonly client: Client
    private readonly logger: ILogger

    constructor(private readonly clientInstance: Client) {
        this.client = clientInstance;
        this.logger = getLogger();
    }

    public async enrichAndReturn(): Promise<Client> {
        try {
            const client = await this.enrich();
            return client;
        } catch (error) {
            this.logger.error('Error while enriching WhatsApp client:', error);
            throw error;
        }
    }

    private enrich(): Client {
        this.logger.debug("Setting up QR code event handler");
        this.client.on('qr', (qr) => {
            this.logger.debug("QR code received, generating terminal output");
            qrTerminal.generate(qr, { small: true });
        });

        this.logger.debug("Setting up client ready event handler");
        this.client.on('ready', async () => {
            this.logger.debug("Client is ready");
        });

        this.logger.debug("Setting up message_create event handler");
        this.client.on('message_create', async (msg) => {
            try {
                this.logger.debug("message_create event triggered");
                const chat = await msg.getChat();
                this.logger.debug("Chat details fetched", { chatName: chat.name, isGroup: chat.isGroup });

                if (chat.isGroup && chat.name === GROUP_NAME) {
                    this.logger.debug("Message belongs to the target group, saving to database");
                    const db = await MongoDbService.getInstance();
                    await db.createOne<WAWebJS.Message>(COLLECTION_NAME!, msg);
                    this.logger.debug("Message saved to database successfully");
                }
                return false;
            } catch (error) {
                this.logger.error("Error in message_create handler (group match):", error);
                return false;
            }
        });

        return this.client;
    }

    /**
     * Helper to fetch last messages in batches and check context with AnthropicLlm
     * Logs the largest batch of messages that are in the same context
     */
    // private async makeSummary(db: MongoDbService): Promise<string> {
    //     const collection = process.env.MONGODB_DB_COLLECTION!; // adjust if your collection name is different
    //     const batchSize = 10;
    //     let skip = 0;
    //     let allMessages: IMessage[] = [];
    //     const llm = AnthropicLlm.getInstance();
    //     let inSameContext = true;

    //     while (inSameContext) {
    //         const batch: IMessage[] = await db.getMany<IMessage>(
    //             collection,
    //             {}, // no filter
    //             { skip, limit: batchSize, sort: { timestamp: -1 } }
    //         );
    //         if (batch.length === 0) break;
    //         allMessages = [...batch.reverse(), ...allMessages];
    //         const contextCheck = allMessages.map(m => ({
    //             date: new Date(m.timestamp * 1000).toISOString(),
    //             text: m.body
    //         }));

    //         inSameContext = (contextCheck.length <= 90) ? await llm.areMessagesInSameContext(contextCheck) : false;

    //         if (inSameContext) {
    //             skip += batchSize;
    //         } else {
    //             inSameContext = false;
    //         }
    //     }
    //     // After loop: if lastBatch has messages, create a summary
    //     if (allMessages.length > 0) {
    //         const summaryInput = allMessages.map(m => ({
    //             date: new Date(m.timestamp * 1000).toISOString(),
    //             text: m.body
    //         }));
    //         try {
    //             const summary = await llm.summarizeMessages(summaryInput);
    //             return summary;
    //         } catch (err) {
    //             this.logger.error('Error creating summary:', err);
    //         }
    //     }
    //     return "Failed to create summary"; // Default return value if no summary is created
    // }
}

