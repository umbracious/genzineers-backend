import { EntityData, ref, wrap } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { User } from "./user.entity.js";
import { initORM } from "../../db.js";
import { getUserFromToken } from "../common/utils.js";
import { hash, verify } from "argon2";

export async function registerUserRoutes(app: FastifyInstance) {
  const db = await initORM();
  app.post("/sign-up", async (request, reply) => {
    const body = request.body as EntityData<User>;

    if (!body.email || !body.fullName || !body.password) {
      throw new Error(
        "One of the required fields is missing: email, fullName, password"
      );
    }

    if (await db.user.exists(body.email)) {
      throw new Error(
        "This  email is already registered, maybe you want to sign in?"
      );
    }

    const user = new User(body.fullName, body.email, body.password);
    user.bio = body.bio ?? "";
    await db.em.persist(user).flush();

    const _refreshToken = await reply.jwtSign(
      { id: user.id },
      { expiresIn: "7d" }
    );
    const refreshTokenHash = await hash(_refreshToken);
    const refreshToken = db.token.create({
      user: ref(User, user.id),
      tokenHash: refreshTokenHash,
    });

    user.token = await reply.jwtSign({ id: user.id }, { expiresIn: "15m" });

    reply.setCookie("refreshToken", _refreshToken, {
      domain: "localhost",
      path: "/",
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    // console.log(reply.getHeaders());

    console.log(`User  ${user.id} created`);

    return user;
  });

  app.post("/sign-in", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const user = await db.user.login(email, password);
    user.token = await reply.jwtSign({ id: user.id }, { expiresIn: "15m" });
    // implement check to see remaining time on refreshToken and be given a new one if little time is left
    return user;
  });

  app.get("/cookies", async (request, reply) => {
    const user = getUserFromToken(request);
    const _refreshToken: string = request.cookies.refreshToken ?? "";
    const refreshToken = await db.token.findToken(user.id);
    if (await verify(refreshToken.tokenHash, _refreshToken)) {
      const token = await reply.jwtSign({ id: user.id }, { expiresIn: "5m" });
      return token;
    }
  });

  app.get("/profile", async (request) => {
    const user = getUserFromToken(request);
    return user;
  });

  app.patch("/profile", async (request) => {
    const user = getUserFromToken(request);
    wrap(user).assign(request.body as User);

    await db.em.flush();
    return user;
  });

  app.post("/enroll", async (request) => {
    const user = getUserFromToken(request);
    const courses = request.body as string[];
    for (let i = 0; i < courses.length; i++) {
      const course = await db.course.getCourseUserRef(courses[i]);
      course.users.add(user);
    }
    await db.em.flush();
  });

  app.get("/enroll", async (request) => {
    const user = getUserFromToken(request);
    const courses = await db.course.getUserEnrolledCourses(user.id);
    return courses;
  });
}
