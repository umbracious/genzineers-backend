import { BeforeCreate, BeforeUpdate, Collection, Entity, EntityRepositoryType, EventArgs, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Course } from "../course/course.entity.js";
import { hash, verify } from "argon2";
import { UserRepository } from "./user.repository.js";

@Entity({ schema: "genzineers", repository: () => UserRepository })
export class User extends BaseEntity {

    [EntityRepositoryType]?: UserRepository;

    @Property({ persist: false })
    token?: string;

    @Property()
    fullName!: string;

    @Property()
    email!: string;

    @Property({ hidden: true, lazy: true })
    password!: string;

    @Property({ type: "text", lazy: true })
    bio = "";

    @ManyToMany({ mappedBy: "users" })
    courses = new Collection<Course>(this);

    constructor(fullName: string, email: string, password: string) {
        super();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    @BeforeCreate()
    @BeforeUpdate() 
    async hashPassword(args: EventArgs<User>) {
        const password = args.changeSet?.payload.password;
        if(password) 
            this.password = await hash(password);
        
    } // the program checks if the entity had the password field updated and if so hashes it
    
    async verifyPassword(password: string) {
        return verify(this.password, password);
    } // function to verify the plaintext password matches the stored hash

}