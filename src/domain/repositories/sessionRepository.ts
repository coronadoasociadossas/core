import { Session } from "../models/session";

export interface ISessionRepository {
    getLastOpenSessionByUserId(userId: string): Promise<Session | undefined>;
    createSession(session: Session): Promise<void>;
    updateSession(sessionId: string, session: Partial<Session>): Promise<void>;
}