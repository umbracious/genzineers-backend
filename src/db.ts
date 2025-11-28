import { EntityManager, EntityRepository, MikroORM, Options } from "@mikro-orm/postgresql";
import { Course } from "./modules/course/course.entity.js";
import { User } from "./modules/user/user.entity.js";

export interface Services {
    orm: MikroORM,
    em: EntityManager,
    course: EntityRepository<Course>;
    user: EntityRepository<User>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
    if(cache)
        return cache;

    const orm = await MikroORM.init(options);
    return cache = {
        orm,
        em: orm.em,
        course: orm.em.getRepository(Course),
        user: orm.em.getRepository(User),
    };
}