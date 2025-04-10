import { User } from '@/domain/models/user';

export interface Session {
    session_id: string;
    user_id: string;
    user?: User;
    ip_address: string;
    login_date: string;   // ISO date string
    logout_date?: string | null;  // ISO date string
    created_at: string;   // ISO date string
    updated_at: string;   // ISO date string
    deleted_at?: string;  // ISO date string, optional
}
