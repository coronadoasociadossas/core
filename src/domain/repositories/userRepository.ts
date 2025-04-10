import { User } from '../models/user';

export interface IUserRepository {
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserById(userId: string): Promise<User | undefined>;
}