import { User } from "@/domain/models/user";
import { IUserRepository } from "@/domain/repositories/userRepository";
import { DynamoRepository } from "@/infrastructure/dynamo/DynamoRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserRepository implements IUserRepository {

    private readonly USER_TABLE = process.env.USERS_TABLE as string;

    constructor(
        @inject(DynamoRepository) private dynamoDBRepository: DynamoRepository
    ) { }

    async getUserById(userId: string): Promise<User | undefined> {
        const user = await this.dynamoDBRepository.get<User>(this.USER_TABLE, {
            user_id: userId,
        });
        return user
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        const [user] = await this.dynamoDBRepository.scan<User>({
            TableName: this.USER_TABLE,
            FilterExpression: "id_number = :id_number OR email = :email",
            ExpressionAttributeValues: {
                ":id_number": { S: username },
                ":email": { S: username },
            },
            Limit: 1,
        });

        return user
    }

    

}