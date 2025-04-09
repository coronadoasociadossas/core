import { MiddlewareObj } from "@middy/core";
import dayjs from "dayjs";
import * as jwt from "jsonwebtoken";


export const AuthMiddleware = (): MiddlewareObj => ({
    before(request: any) {
        const authHeader = request.event.headers.Authorization || request.event.headers.authorization;
        if (!authHeader) {
            throw new Error("Unauthorized: No token provided");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Unauthorized: Invalid token format");
        }


        const payload = jwt.decode(token) as jwt.JwtPayload;
        if (!payload) {
            throw new Error("Unauthorized: Invalid token");
        }

        if (payload.exp && payload.exp < dayjs().unix()) throw new Error("Unauthorized: Token expired");

        request.user = payload
    },
    after(request: any) {
        // Do nothing
    },
    onError(request: any) {
        return {
            statusCode: request.error.statusCode || 500,
            body: JSON.stringify({
                error: request.error.message || "Internal Server Error",
            }),
        }
    }
})