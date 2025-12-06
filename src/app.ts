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

// full setup is in the docker-compose.yml+.env and the file applying it is mikro-orm.config.ts

export async function bootstrap(migrate = true) {
    const db = await initORM();
    const app = fastify();

    if(migrate)
        await db.orm.migrator.up();

    app.register(fastifyCookie);

    app.addHook("onRequest", async request => {
        console.log(`Origin: ${request.headers.origin}`);
    });

    await app.register(cors, {
    origin: ["http://127.0.0.1:1420", "http://localhost:1420"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })

    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET ?? "123456"
    });

    

    app.addHook("onRequest", (request, reply, done) => {
        RequestContext.create(db.orm.em, done);
    });

    app.addHook("onRequest", async request => {
        try {
            const ret = await request.jwtVerify<{id: string}>();
            request.user = await db.user.findOneOrFail(ret.id);
        } catch (e) {
            app.log.error(e);
        }
    });

    app.setErrorHandler((error, request, reply) => {
        if(error instanceof AuthError) 
            return reply.status(401).send({ error: error.message });
        
        if(error instanceof NotFoundError) 
            return reply.status(404).send({ error: error.message });

        app.log.error(error);
        reply.status(500).send({ error: error.message });
    })

    app.addHook("onClose", async () => {
        await db.orm.close();
    });

    app.register(registerUserRoutes, { prefix: "user" });
    app.register(registerCourseRoutes, { prefix: "course" });


    const url = await app.listen({ port: Number(process.env.NODE_DOCKER_PORT), host: process.env.NODE_HOST });

    return { app, url };
}