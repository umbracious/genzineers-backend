import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { User } from "../user/user.entity.js";
import { BaseEntity } from "../common/base.entity.js";
import { CourseRepository } from "./course.repository.js";

@Entity({ schema: "genzineers", repository: () => CourseRepository})
export class Course extends BaseEntity {

    [EntityRepositoryType]?: CourseRepository;

    @Property()
    title!: string;

    @Property()
    code!: string;

    @Property()
    image?: string;

    @Property()
    startDate?: Date;

    @Property()
    endDate?: Date;

    @Property()
    link?: string;

    @Property()
    description?: string;

    @ManyToMany()
    users = new Collection<User>(this);

}