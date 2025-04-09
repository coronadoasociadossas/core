
import { Model, Op } from "sequelize";
import { MysqlSessionModel } from "../models/session";
import { SessionRepository } from "@/domain/repositories/sessionRepository";
import { Session } from "@/domain/models/session";




export class SessionRepositoryMysql implements SessionRepository {
    async checkLastOpenSession(user_id: string): Promise<Session | null> {
        const session = await MysqlSessionModel.findOne({
            where: {
                user_id,
                logout_date: null,
                login_date: {
                    [Op.lt]: Date.now(),
                }
            }
        })
        return session ? session.toJSON() : null;
    }


    async updateSession(id: string): Promise<void> {
        const session = await MysqlSessionModel.findOne({
            where: {
                user_id: id,
                logout_date: null,
                login_date: {
                    [Op.lt]: Date.now(),
                }
            },
            order: [["login_date", "DESC"]],
            limit: 1,
        })

        if (!session) throw new Error("Session not found or already logged out")
        
        session.dataValues.logout_date = new Date(Date.now())
        await session.save()
        
    }

    


}