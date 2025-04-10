import { AttributeValue, BatchGetItemCommand, BatchWriteItemCommand, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { IDynamoRepository } from './IDynamoRepository';
import { injectable } from 'tsyringe';

@injectable()
export class DynamoRepository implements IDynamoRepository {
    private client: DynamoDBClient;

    constructor() {
        this.client = new DynamoDBClient({});
    }

    async put<T>(tableName: string, item: T): Promise<void> {
        const params = {
            TableName: tableName,
            Item: marshall(item, {
                removeUndefinedValues: true, // Remove undefined values from the item
            }) // Convert the item to DynamoDB format,
        };
        await this.client.send(new PutItemCommand(params));
    }

    async get<T>(tableName: string, key: Partial<T>): Promise<T | undefined> {
        const params = {
            TableName: tableName,
            Key: marshall(key, {
                removeUndefinedValues: true, // Remove undefined values from the key
            }), // Convert the key to DynamoDB format
        };
        const result = await this.client.send(new GetItemCommand(params));
        return result.Item as T; // Return the item as a JavaScript object
    }

    async query<T>(params: QueryCommandInput): Promise<T[]> {
        const result = await this.client.send(new QueryCommand(params));
        const data = result.Items ?? [];
        return data.map(item => unmarshall(item)) as T[]; // Unmarshall the data to convert it to a JavaScript object
    }

    async scan<T>(params: ScanCommandInput): Promise<T[]> {
        const result = await this.client.send(new ScanCommand(params));
        const data = result.Items ?? [];
        return data.map(item => unmarshall(item)) as T[]; // Unmarshall the data to convert it to a JavaScript object
    }

    async delete(tableName: string, key: any): Promise<void> {
        const params = {
            TableName: tableName,
            Key: key,
        };
        await this.client.send(new DeleteItemCommand(params));
    }

    async batchWrite(tableName: string, items: any[]): Promise<void> {
        const batchItems = items.map(item => ({
            PutRequest: {
                Item: item
            }
        }));

        const params = {
            RequestItems: {
                [tableName]: batchItems
            }
        };

        await this.client.send(new BatchWriteItemCommand(params));
    }

    async batchGet(tableName: string, keys: any[]): Promise<any[]> {
        const params = {
            RequestItems: {
                [tableName]: {
                    Keys: keys
                }
            }
        };

        const result = await this.client.send(new BatchGetItemCommand(params));
        return result.Responses?.[tableName] || [];
    }

    async update<T>(tableName: string, key: Record<string, AttributeValue>, updateData: Partial<T>): Promise<void> {
        const { updateExpression, expressionAttributeValues, expressionAttributeNames } = this.buildUpdateExpression(updateData);
        const params: UpdateItemCommandInput = {
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ExpressionAttributeNames: expressionAttributeNames
        };
        await this.client.send(new UpdateItemCommand(params));
    }

    private buildUpdateExpression(updateData: any): {
        updateExpression: string;
        expressionAttributeValues: any;
        expressionAttributeNames: any;
    } {
        const sets: string[] = [];
        const expressionAttributeValues: any = {};
        const expressionAttributeNames: any = {};

        Object.entries(updateData).forEach(([key, value]) => {
            const attributeName = `#${key}`;
            const attributeValue = `:${key}`;
            sets.push(`${attributeName} = ${attributeValue}`);
            expressionAttributeNames[attributeName] = key;
            expressionAttributeValues[attributeValue] = value;
        });

        return {
            updateExpression: `SET ${sets.join(', ')}`,
            expressionAttributeValues,
            expressionAttributeNames
        };
    }
}
