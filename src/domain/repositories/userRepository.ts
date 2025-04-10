import { User } from '../models/user';

export interface IUserRepository {
    getUserByUsername(username: string): Promise<User | undefined>;
}