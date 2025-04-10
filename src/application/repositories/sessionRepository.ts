import { Session } from "@/domain/models/session";
import { User } from "@/domain/models/user";
import { ISessionRepository } from "@/domain/repositories/sessionRepository";
import { IUserRepository } from "@/domain/repositories/userRepository";
import { DynamoRepository } from "@/infrastructure/dynamo/DynamoRepository";
import { marshall } from "@aws-sdk/util-dynamodb";
import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";

@injectable()
export class SessionRepository implements ISessionRepository {

    private readonly SESSION_TABLE = process.env.SESSIONS_TABLE as string;

    constructor(
        @inject(DynamoRepository) private dynamoDBRepository: DynamoRepository
    ) { }


    async updateSession(sessionId: string, session: Partial<Session>): Promise<void> {
        const key = marshall({
            session_id: sessionId,
        });
        await this.dynamoDBRepository.update<Session>(this.SESSION_TABLE, key, session);
    }

    async getLastOpenSessionByUserId(userId: string): Promise<Session | undefined> {
        const todayStart = dayjs().startOf("day").toISOString();
        const tomorrowStart = dayjs().add(1, "day").startOf("day").toISOString();
        const [session] = await this.dynamoDBRepository.scan<Session>({
            TableName: this.SESSION_TABLE,
            FilterExpression: "user_id = :id AND login_date >= :today AND login_date < :tomorrow AND logout_date = :null",
            ExpressionAttributeValues: {
                ":id": {
                    S: userId
                },
                ":today": {
                    S: todayStart,
                },
                ":tomorrow": {
                    S: tomorrowStart,
                },
                ":null": {
                    NULL: true,
                },
            },
            Limit: 1,
        })

        return session
    }


    async createSession(session: Session): Promise<void> {
        await this.dynamoDBRepository.put<Session>(this.SESSION_TABLE, session);
    }




}