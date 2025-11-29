import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "./user.entity.js";
import { AuthError } from "../common/utils.js";

export class UserRepository extends EntityRepository<User> {
    async exists(email: string) {
        const count = await this.count({ email });
        return count > 0;
    }

    async login(email: string, password: string) {
        const err = new AuthError("Invalid combination of email and password");
        const user = await this.findOneOrFail({ email }, {
            populate: ["password"],
            failHandler: () => err
        });

        if (await user.verifyPassword(password))
            return user;

        throw err;
    }
}