import { User } from "@/domain/models/user";
import { UserRepository } from "@/domain/repositories/userRepository";
import { MysqlUserModel } from "@/infrastructure/mysql/models/user";
import { Op } from "sequelize";


export class UserRepositoryMysql implements UserRepository {
    
    async getUserByUsername(username: string): Promise<User | null> {
        const user = await MysqlUserModel.findOne({
            where: {
                [Op.or]: [
                    { email: username },
                    { id_number: username },
                ]
            },
        })

        return user ? user.toJSON() as User : null;
    }
    
}