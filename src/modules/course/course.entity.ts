import { Collection, Entity, ManyToMany, ManyToOne, Property, Ref } from "@mikro-orm/core";
import { User } from "../user/user.entity.js";
import { BaseEntity } from "../common/base.entity.js";
import { Tag } from "./tag.entity.js";

@Entity({ schema: "genzineers"})
export class Course extends BaseEntity {

    @Property()
    title!: string;

    @Property()
    code!: string;

    @ManyToOne()
    user!: User;

    @ManyToMany()
    tags = new Collection<Tag>(this);
}