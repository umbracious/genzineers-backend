import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Course } from "./course.entity.js";

@Entity()
export class Tag extends BaseEntity {

    @Property({ length: 20 })
    name!: string;

    @ManyToMany({ mappedBy: "tags"})
    courses = new Collection<Course>(this);
}