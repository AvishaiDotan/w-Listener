import { MongoClient, Db, Document, WithId, OptionalUnlessRequiredId } from "mongodb";
import { IDbService } from "./db.interface";


export class MongoDbService implements IDbService {
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private static instance: MongoDbService;

    public static async getInstance(connectionString?: string, dbName?: string): Promise<MongoDbService> {
        if (MongoDbService.instance) return MongoDbService.instance;
        else {
            MongoDbService.instance = new MongoDbService();
            await MongoDbService.instance.connect(connectionString!, dbName!);
            return MongoDbService.instance;
        }
    }

    async connect(connectionString: string, dbName: string) {
        try {
            this.client = await MongoClient.connect(connectionString);
            this.db = this.client.db(dbName);
        } catch (error) {
            throw error;
        }
    }

    private getCollection<T extends Document>(collection: string) {
        if (!this.db) throw new Error("Database not connected");
        return this.db.collection<T>(collection);
    }

    async getOne<T extends Document>(collection: string, filter: any): Promise<WithId<T> | null> {
        return this.getCollection<T>(collection).findOne(filter);
    }

    async getMany<T extends Document>(collection: string, filter: any = {}, options?: { skip?: number, limit?: number, sort?: any }): Promise<WithId<T>[]> {
        const { skip = 0, limit = 0, sort = {} } = options || {};
        return this.getCollection<T>(collection)
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    async deleteOne(collection: string, filter: any): Promise<any> {
        return this.getCollection(collection).deleteOne(filter);
    }

    async deleteMany(collection: string, filter: any): Promise<any> {
        return this.getCollection(collection).deleteMany(filter);
    }

    async updateOne(collection: string, filter: any, update: any, options: any = {}): Promise<any> {
        return this.getCollection(collection).updateOne(filter, update, options);
    }

    async updateMany(collection: string, filter: any, update: any, options: any = {}): Promise<any> {
        return this.getCollection(collection).updateMany(filter, update, options);
    }

    async createOne<T extends Document>(collection: string, doc: OptionalUnlessRequiredId<T>): Promise<any> {
        return this.getCollection<T>(collection).insertOne(doc);
    }

    async createMany<T extends Document>(collection: string, docs: OptionalUnlessRequiredId<T>[]): Promise<any> {
        return this.getCollection<T>(collection).insertMany(docs);
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}