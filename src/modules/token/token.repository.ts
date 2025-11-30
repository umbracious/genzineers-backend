import { EntityRepository, ref } from "@mikro-orm/postgresql";
import { AuthError } from "../common/utils.js";
import { Token } from "./token.entity.js";
import { FastifyInstance } from "fastify";
import { User } from "../user/user.entity.js";

export class TokenRepository extends EntityRepository<Token> {
  async findToken(id: string) {
    return await this.findOneOrFail({ user: ref(User, id) });
  }
}
