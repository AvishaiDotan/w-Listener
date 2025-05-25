import { Client, LocalAuth } from "whatsapp-web.js";

export type IWhatsappWebEvent =
    | {
        onState: "ready" | "disconnected" | "qr" | "message";
        onActionAsync: (payload: any) => Promise<void>;
        onAction?: never;
        name?: string;
    }
    | {
        onState: "ready" | "disconnected" | "qr" | "message";
        onAction: (payload: any) => void;
        onActionAsync?: never;
        name?: string;
    };

export class WhatsappWebService {
    private client: Client;

    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox']
            }
        })
    }

    public getClient(): Client {
        return this.client;
    }

    public async initializeClient() {
        await this.client.initialize();
    }
}