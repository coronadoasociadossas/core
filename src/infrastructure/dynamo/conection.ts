import AWS from 'aws-sdk';

export class DynamoDBConnection {
    private static instance: DynamoDBConnection;
    private docClient: AWS.DynamoDB.DocumentClient;

    private constructor() {
        AWS.config.update({
            region: process.env.AWS_REGION || 'us-east-1',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        });

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    public static getInstance(): DynamoDBConnection {
        if (!DynamoDBConnection.instance) {
            DynamoDBConnection.instance = new DynamoDBConnection();
        }
        return DynamoDBConnection.instance;
    }

    public getDocumentClient(): AWS.DynamoDB.DocumentClient {
        return this.docClient;
    }
}