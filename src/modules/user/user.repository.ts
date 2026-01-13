import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "./user.entity.js";
import { AuthError } from "../common/utils.js";

export class UserRepository extends EntityRepository<User> {

    async register() {
        
    }

    // createAuthUser();
    // fetchAuthUser();
    // updateAuthUser();
    // deleteAuthUser();

}