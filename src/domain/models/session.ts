import { User } from "./user";


export interface Session {
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