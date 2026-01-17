import { EntityData, ref, wrap } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { User } from "./user.entity.js";
import { initORM } from "../../db.js";
import { hash, verify } from "argon2";
import { getCurrentUser } from "../common/utils.js";

export async function registerUserRoutes(app: FastifyInstance) {
  const db = await initORM();

  app.post("/enroll", async (request) => {
    const { code, id } = request.body as { code: string; id: string };
    const user = await db.user.findOneOrFail({ authUserId: id });
    console.log(id);
    console.log(code);
    const course = await db.course.getCourseUserRef(code);
    if (course.users.contains(user)) throw new Error("Duplicate");
    course.users.add(user);
    await db.em.flush();
    // prevent duplicate enrolling
    return { status: 200, message: "success" };
  });

  app.get("/enroll", async (request) => {
    // const user = getUserFromToken(request);
    // const courses = await db.course.getUserEnrolledCourses(user.id);
    // return courses;
    //update
  });

  app.post("/register", async (request, reply) => {
    const { id } = request.body as { id: string };
    const user = await db.user.create({
      authUserId: id,
    });
    await db.em.flush();
  });

  app.post("/test", async (request, reply) => {
    const user = getCurrentUser(request);
    return user;
  });

  app.post("/update", async (request, reply) => {});
  app.post("/delete", async (request, reply) => {});
}
