import { Entity, EntityRepositoryType, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../common/base.entity.js';
import { User } from '../user/user.entity.js';
import { TokenRepository } from './token.repository.js';

@Entity({ repository: () => TokenRepository })
export class Token extends BaseEntity {

  [EntityRepositoryType]?: TokenRepository;

  @ManyToOne()
  user!: Ref<User>;

  @Property()
  tokenHash!: string;

  @Property()
  device?: string;

  @Property()
  ip?: string;

  @Property()
  expiresAt?: Date;

  @Property()
  revoked?: boolean = false;

}