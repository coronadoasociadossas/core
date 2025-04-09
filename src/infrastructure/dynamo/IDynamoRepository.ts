export interface IDynamoRepository {
    // Create or Update item
    put(tableName: string, item: any): Promise<void>;
    
    // Get single item by primary key
    get(tableName: string, key: any): Promise<any>;
    
    // Query items using index
    query<T>(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<T[]>;
    
    // Scan all items (use with caution)
    scan<T>(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<T[]>;
    
    // Delete an item
    delete(tableName: string, key: any): Promise<void>;
    
    // Batch write items (put or delete)
    batchWrite(tableName: string, items: any[]): Promise<void>;
    
    // Batch get items
    batchGet(tableName: string, keys: any[]): Promise<any[]>;
    
    // Update an item
    update(tableName: string, key: any, updateData: any): Promise<void>;
}
