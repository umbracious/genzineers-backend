import { EntityManager, EntityRepository, MikroORM, Options } from "@mikro-orm/postgresql";
import { Course } from "./modules/course/course.entity.js";
import { User } from "./modules/user/user.entity.js";
import { UserRepository } from "./modules/user/user.repository.js";
import { CourseRepository } from "./modules/course/course.repository.js";

export interface Services {
    orm: MikroORM,
    em: EntityManager,
    course: CourseRepository;
    user: UserRepository;
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