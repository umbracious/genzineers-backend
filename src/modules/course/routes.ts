import { FastifyInstance } from "fastify";
import { initORM } from "../../db.js";

export async function registerCourseRoutes(app: FastifyInstance) {
    const db = await initORM();

    app.get("/", async request => {
        const { limit, offset } = request.query as { limit?: number; offset?: number };
        const [items, total] = await db.course.findAndCount({}, {
            limit, offset
        });

        return { items, total };
    });

    app.post("/", async request => {
        const { title, code } = request.body as { title: string; code: string };

        const course = db.course.create({
            title,
            code
        });

        await db.em.flush();

        return course;
    })

    app.get("/:code", async request => {
        const { code } = request.params as { code: string };
        return db.course.findOneOrFail({ code }, {
            populate: ["users"]
        });
    });

    app.delete("/:id", async request => {
        const params = request.params as { id: string };
        const course = await db.course.findOne(params.id);

        if(!course)
            return { notFound: true };

        await db.em.remove(course).flush();

        return { success: true };
    });
}