import { MongoClient, Document, WithId, OptionalUnlessRequiredId } from "mongodb";

export interface IDbService {
    connect(connectionString: string, dbName: string): Promise<void>;
    disconnect(): Promise<void>;
    getOne<T extends Document>(collection: string, filter: any): Promise<WithId<T> | null>;
    getMany<T extends Document>(collection: string, filter?: any): Promise<WithId<T>[]>;
    deleteOne(collection: string, filter: any): Promise<any>;
    deleteMany(collection: string, filter: any): Promise<any>;
    updateOne(collection: string, filter: any, update: any, options?: any): Promise<any>;
    updateMany(collection: string, filter: any, update: any, options?: any): Promise<any>;
    createOne<T extends Document>(collection: string, doc: OptionalUnlessRequiredId<T>): Promise<any>;
    createMany<T extends Document>(collection: string, docs: OptionalUnlessRequiredId<T>[]): Promise<any>;
}
