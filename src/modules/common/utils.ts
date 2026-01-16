import { FastifyRequest } from "fastify";
import { auth } from "../../utils/auth.js";

export class AuthError extends Error {}

export const getCurrentUser = async (req: FastifyRequest) => {
  const headers = new Headers();
  if (req.headers.cookie) {
    headers.set("cookie", req.headers.cookie);
  }
  const user = await auth.api.getSession({
    headers,
  });
  return user;
};
