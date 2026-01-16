import { EntityData, ref, wrap } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { User } from "./user.entity.js";
import { initORM } from "../../db.js";
import { hash, verify } from "argon2";
import { getCurrentUser } from "../common/utils.js";

export async function registerUserRoutes(app: FastifyInstance) {
  const db = await initORM();

  app.post("/enroll", async (request) => {
    const { courses, id } = request.body as { courses: string[]; id: string };
    const user = await db.user.findOneOrFail({ authUserId: id });
    for (let i = 0; i < courses.length; i++) {
      const course = await db.course.getCourseUserRef(courses[i]);
      course.users.add(user);
    }
    await db.em.flush();
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
