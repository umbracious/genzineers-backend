import { MikroORM } from "@mikro-orm/postgresql";
import { User } from "./modules/user/user.entity.js";
import { Course } from "./modules/course/course.entity.js";
import { bootstrap } from "./app.js";

try {
    const { url } = await bootstrap();
    console.log(`server started at ${url}`);
} catch(e) {
    console.error(e);
}
// const user = new User();
// user.email = "foo@bar.com";
// user.fullName = "Foo Bar";
// user.password = "123456";

// const em = orm.em.fork({ schema: "genzineers" });

// await em.persist(user).flush();

// const course = em.create(Course, {
//     title: "Physics",
//     code: "A94",
//     user: user.id
// });

// user.courses.add(course);

// await em.flush();
