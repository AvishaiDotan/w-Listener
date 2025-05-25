import { AnthropicLlm } from "./services/llm.service";
import { getLogger, LogLevel } from "./services/logger.service";
import dotenv from "dotenv";
dotenv.config();

const logger = getLogger(LogLevel.debug);

const CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING
const DB_NAME = process.env.MONGODB_DB_NAME
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY


import { MongoDbService } from "./services/mongoDb.service";
import { WhatsappWebService } from "./services/whatsappWeb.service";
import { WhatsappEventEnricher } from "./whatsappEvents";

async function main() {
    logger.debug("Starting main function");

    try {
        logger.debug("Initializing MongoDbService");
        const mongoDbService = await MongoDbService.getInstance(CONNECTION_STRING, DB_NAME);
        logger.debug("MongoDbService initialized successfully");

        logger.debug("Initializing AnthropicLlm service");
        const LlmService = AnthropicLlm.getInstance(ANTHROPIC_API_KEY);
        logger.debug("AnthropicLlm service initialized successfully");

        logger.debug("Initializing WhatsappWebService");
        const whatsappWebService = new WhatsappWebService();
        const client = whatsappWebService.getClient();
        logger.debug("WhatsappWebService initialized successfully");

        logger.debug("Initializing WhatsappEventEnricher");
        const whatsappEventEnricher = new WhatsappEventEnricher(client);
        await whatsappEventEnricher.enrichAndReturn();
        logger.debug("WhatsappEventEnricher processed events successfully");

        logger.debug("Initializing WhatsappWebService client");
        await whatsappWebService.initializeClient();
        logger.debug("WhatsappWebService client initialized successfully");
    } catch (error) {
        logger.error("An error occurred in the main function", error);
        throw error;
    }
}

main()
    .then(() => logger.debug("Application started successfully"))
    .catch((error) => logger.error("Application failed to start", error));

