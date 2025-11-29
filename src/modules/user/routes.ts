import { EntityData, wrap } from "@mikro-orm/core";
import { FastifyInstance } from "fastify";
import { User } from "./user.entity.js";
import { initORM } from "../../db.js";
import { getUserFromToken } from "../common/utils.js";

export async function registerUserRoutes(app: FastifyInstance) {
    const db =  await initORM(); 
    app.post("/sign-up", async request => {
        const body = request.body as EntityData<User>;

        if(!body.email || !body.fullName || !body.password) {
            throw new Error("One of the required fields is missing: email, fullName, password");
        }

        if(await db.user.exists(body.email)) {
            throw new Error("This  email is already registered, maybe you want to sign in?");
        }

        const user = new User(body.fullName, body.email, body.password);
        user.bio = body.bio ?? "";
        await db.em.persist(user).flush();

        user.token = app.jwt.sign({ id: user.id });

        console.log(`User  ${user.id} created`);

        return user;
    });

    app.post("/sign-in", async request => {
        const { email, password } = request.body as { email: string; password: string };
        const user = await db.user.login(email, password);
        user.token = app.jwt.sign({ id: user.id });
        
        return user;
    })

    app.get("/profile", async request => {
        const user = getUserFromToken(request);
        return user;
    });

    app.patch("/profile", async request => {
        const user = getUserFromToken(request);
        wrap(user).assign(request.body as User);
        
        await db.em.flush();
        return user;
    });
}