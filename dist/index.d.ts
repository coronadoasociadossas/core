import { MiddlewareObj } from '@middy/core';
import mongoose from 'mongoose';
import * as sequelize$1 from 'sequelize';
import { Sequelize, Model } from 'sequelize';

interface User {
    id: string;
    id_type: string;
    id_number: string;
    names: string;
    last_names: string;
    email: string;
    password: string;
    temp_password: boolean;
    phone: string;
    address: string;
    gender: string;
    wrong_login_attempts: number;
    status: number;
    role: string;
    policies?: [];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface Session {
    id: string;
    ip_address: string;
    user_id: string;
    user?: User;
    login_date: Date;
    logout_date: Date | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

interface SessionRepository {
    updateSession(id: string): Promise<void>;
    checkLastOpenSession(user_id: string): Promise<Session | null>;
}

interface UserRepository {
    getUserByUsername(username: string): Promise<User | null>;
}

declare const AuthMiddleware: () => MiddlewareObj;

interface UserManagement {
    user_id: string;
}
declare const UserManagementModel: mongoose.Model<UserManagement, {}, {}, {}, mongoose.Document<unknown, {}, UserManagement> & UserManagement & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;

declare const sequelize: Sequelize;

declare const MysqlSessionModel: sequelize$1.ModelCtor<Model<Session, Session>>;

declare const MysqlUserModel: sequelize$1.ModelCtor<sequelize$1.Model<any, any>>;

declare class SessionRepositoryMysql implements SessionRepository {
    checkLastOpenSession(user_id: string): Promise<Session | null>;
    updateSession(id: string): Promise<void>;
}

declare class UserRepositoryMysql implements UserRepository {
    getUserByUsername(username: string): Promise<User | null>;
}

export { AuthMiddleware, MysqlSessionModel, MysqlUserModel, type Session, type SessionRepository, SessionRepositoryMysql, type User, type UserManagement, UserManagementModel, type UserRepository, UserRepositoryMysql, sequelize };
