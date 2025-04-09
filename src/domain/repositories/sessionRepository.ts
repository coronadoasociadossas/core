import { Session } from "../models/session";

export interface SessionRepository {
    updateSession(id: string): Promise<void>;
    checkLastOpenSession(user_id: string): Promise<Session | null>;
}