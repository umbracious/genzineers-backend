import { FastifyRequest } from "fastify";
import { User } from "../user/user.entity.js";

export class AuthError extends Error {}

export function getUserFromToken(req: FastifyRequest): User {
    if(!req.user)
        throw new Error("Please provide your token via Authorization header");

    return req.user as User;
}