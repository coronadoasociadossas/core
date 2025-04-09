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
        const params = {
            TableName: tableName,
            Item: item
        };
        await this.docClient.put(params).promise();
    }

    async get(tableName: string, key: any): Promise<any> {
        const params = {
            TableName: tableName,
            Key: key
        };
        const result = await this.docClient.get(params).promise();
        return result.Item;
    }

    async query(tableName: string, params: any): Promise<any[]> {
        const queryParams = {
            TableName: tableName,
            ...params
        };
        const result = await this.docClient.query(queryParams).promise();
        return result.Items || [];
    }

    async scan(tableName: string, params?: any): Promise<any[]> {
        const scanParams = {
            TableName: tableName,
            ...params
        };
        const result = await this.docClient.scan(scanParams).promise();
        return result.Items || [];
    }

    async delete(tableName: string, key: any): Promise<void> {
        const params = {
            TableName: tableName,
            Key: key
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

        const params = {
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
