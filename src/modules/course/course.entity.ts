import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { User } from "../user/user.entity.js";
import { BaseEntity } from "../common/base.entity.js";
import { Tag } from "./tag.entity.js";
import { CourseRepository } from "./course.repository.js";

@Entity({ schema: "genzineers", repository: () => CourseRepository})
export class Course extends BaseEntity {

    [EntityRepositoryType]?: CourseRepository;

    @Property()
    title!: string;

    @Property()
    code!: string;

    @ManyToMany()
    users = new Collection<User>(this);

    @ManyToMany()
    tags = new Collection<Tag>(this);
}