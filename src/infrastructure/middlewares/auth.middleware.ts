import { MiddlewareObj } from "@middy/core";
import dayjs from "dayjs";
import * as jwt from "jsonwebtoken";

class UnauthorizedError extends Error {
    constructor(message: string, public statusCode: number = 401) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = statusCode;
    }
}

export const AuthMiddleware = (): MiddlewareObj => ({
    before(request: any) {
        const authHeader = request.event.headers.Authorization || request.event.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new UnauthorizedError("Invalid token format");
        }

        const payload = jwt.decode(token) as jwt.JwtPayload;
        if (!payload) {
            throw new UnauthorizedError("Invalid token");
        }

        if (payload.exp && payload.exp < dayjs().unix()) {
            throw new UnauthorizedError("Token expired");
        }

        request.user = payload
    },
    after(request: any) {
        // Do nothing
    },
    onError(request: any) {
        return {
            statusCode: request.error.statusCode || 500,
            body: JSON.stringify({
                message: request.error.message || "Internal Server Error",
                code: request.error.statusCode || 500
            }),
        };
    }
})