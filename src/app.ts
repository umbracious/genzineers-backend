import { RequestContext } from "@mikro-orm/core";
import fastify from "fastify";
import { Course } from "./modules/course/course.entity.js";
import { initORM } from "./db.js";

// full setup is in the docker-compose.yml+.env and the file applying it is mikro-orm.config.ts

export async function bootstrap(port = 8080, migrate = true) {
    const db = await initORM();
    const app = fastify();

    if(migrate)
        await db.orm.migrator.up();

    app.addHook("onRequest", (request, reply, done) => {
        RequestContext.create(db.orm.em, done);
    });

    app.addHook("onClose", async () => {
        await db.orm.close();
    });

    app.get("/course", async request => {
        const { limit, offset } = request.query as { limit?: number; offset?: number };
        const [items, total] = await db.orm.em.findAndCount(Course, {}, {
            limit, offset
        });

        return { items, total };
    })

    const url = await app.listen({ port });

    return { app, url };
}