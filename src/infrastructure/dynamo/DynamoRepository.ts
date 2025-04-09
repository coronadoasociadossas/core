import { DynamoDBConnection } from './conection';
import { IDynamoRepository } from './IDynamoRepository';
import AWS from 'aws-sdk';

export class DynamoRepository implements IDynamoRepository {
    private docClient: AWS.DynamoDB.DocumentClient;

    constructor() {
        const connection = DynamoDBConnection.getInstance();
        this.docClient = connection.getDocumentClient();
    }

    async put(tableName: string, item: any): Promise<void> {
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: tableName,
            Item: item,
        };
        await this.docClient.put(params).promise();
    }

    async get(tableName: string, key: any): Promise<any> {
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: key
        };
        const result = await this.docClient.get(params).promise();
        return result.Item;
    }

    async query<T>(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<T[]> {
        const result = await this.docClient.query(params).promise();
        return result.Items as T[] || [];
    }

    async scan<T>(params: AWS.DynamoDB.DocumentClient.ScanInput): Promise<T[]> {
        const result = await this.docClient.scan(params).promise();
        return result.Items as T[] || [];
    }

    async delete(tableName: string, key: any): Promise<void> {
        const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: tableName,
            Key: key,
        };
        await this.docClient.delete(params).promise();
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

        await this.docClient.batchWrite(params).promise();
    }

    async batchGet(tableName: string, keys: any[]): Promise<any[]> {
        const params = {
            RequestItems: {
                [tableName]: {
                    Keys: keys
                }
            }
        };

        const result = await this.docClient.batchGet(params).promise();
        return result.Responses?.[tableName] || [];
    }

    async update(tableName: string, key: any, updateData: any): Promise<void> {
        const { updateExpression, expressionAttributeValues, expressionAttributeNames } = this.buildUpdateExpression(updateData);

        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames
        };

        await this.docClient.update(params).promise();
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
