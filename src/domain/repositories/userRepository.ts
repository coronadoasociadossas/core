import { User } from '../models/user';

export interface UserRepository {
    getUserByUsername(username: string): Promise<User | null>;
}