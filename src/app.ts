import { NotFoundError, RequestContext } from "@mikro-orm/core";
import fastify from "fastify";
import { Course } from "./modules/course/course.entity.js";
import { initORM } from "./db.js";
import { registerUserRoutes } from "./modules/user/routes.js";
import { registerCourseRoutes } from "./modules/course/routes.js";
import fastifyJwt from "@fastify/jwt";
import { AuthError } from "./modules/common/utils.js";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { auth } from "./utils/auth.js";

// full setup is in the docker-compose.yml+.env and the file applying it is mikro-orm.config.ts

export async function bootstrap(migrate = true) {
  const db = await initORM();
  const app = fastify();

  if (migrate) await db.orm.migrator.up();

  app.register(fastifyCookie);

  app.addHook("onRequest", async (request) => {
    console.log(`Origin: ${request.cookies.refreshToken}`);
  });

  await app.register(cors, {
    origin: ["http://127.0.0.1:1420", "http://localhost:1420"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? "123456",
  });

  app.addHook("onRequest", (request, reply, done) => {
    RequestContext.create(db.orm.em, done);
  });

  app.addHook("onRequest", async (request) => {
    try {
      const ret = await request.jwtVerify<{ id: string }>();
      request.user = await db.user.findOneOrFail(ret.id);
    } catch (e) {
      app.log.error(e);
    }
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthError)
      return reply.status(401).send({ error: error.message });

    if (error instanceof NotFoundError)
      return reply.status(404).send({ error: error.message });

    app.log.error(error);
    reply.status(500).send({ error: error.message });
  });

  app.addHook("onClose", async () => {
    await db.orm.close();
  });

  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });

        // Process authentication request
        const response = await auth.handler(req);

        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        app.log.error("Authentication Error:", error);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });

  app.register(registerUserRoutes, { prefix: "user" });
  app.register(registerCourseRoutes, { prefix: "course" });

  const url = await app.listen({
    port: Number(process.env.NODE_DOCKER_PORT),
    host: process.env.NODE_HOST,
  });

  return { app, url };
}
