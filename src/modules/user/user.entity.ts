import { BeforeCreate, BeforeUpdate, Collection, Entity, EntityRepositoryType, EventArgs, ManyToMany, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Course } from "../course/course.entity.js";
import { hash, verify } from "argon2";
import { UserRepository } from "./user.repository.js";

@Entity({ schema: "genzineers", repository: () => UserRepository })
export class User extends BaseEntity {

    [EntityRepositoryType]?: UserRepository;

    @ManyToMany({ mappedBy: "users" })
    courses = new Collection<Course>(this);

    @Property({ unique: true, index: true })
    authUserId!: string;

}