import { QueryCommandInput, ScanCommandInput } from '@aws-sdk/client-dynamodb';

export interface IDynamoRepository {
    // Create or Update item
    put<T>(tableName: string, item: T): Promise<void>;

    // Get single item by primary key
    get<T>(tableName: string, key: Partial<T>): Promise<T | undefined>;

    // Query items using index
    query<T>(params: QueryCommandInput): Promise<T[]>;

    // Scan all items (use with caution)
    scan<T>(params: ScanCommandInput): Promise<T[]>;

    // Delete an item
    delete(tableName: string, key: Record<string, any>): Promise<void>;

    // Batch write items (put or delete)
    batchWrite(tableName: string, items: Record<string, any>[]): Promise<void>;

    // Batch get items
    batchGet(tableName: string, keys: Record<string, any>[]): Promise<Record<string, any>[]>;

    // Update an item
    update(tableName: string, key: Record<string, any>, updateData: Record<string, any>): Promise<void>;
}
