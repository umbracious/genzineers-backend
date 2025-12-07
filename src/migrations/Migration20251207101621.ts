import { Migration } from '@mikro-orm/migrations';

export class Migration20251207101621 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "genzineers"."token" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "token_hash" varchar(255) not null, "device" varchar(255) null, "ip" varchar(255) null, "expires_at" timestamptz null, "revoked" boolean null default false, constraint "token_pkey" primary key ("id"));`);

    this.addSql(`alter table "genzineers"."token" add constraint "token_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade;`);

    this.addSql(`drop table if exists "token" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "token" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "token_hash" varchar(255) not null, "device" varchar(255) null, "ip" varchar(255) null, "expires_at" timestamptz null, "revoked" boolean null default false, constraint "token_pkey" primary key ("id"));`);

    this.addSql(`alter table "token" add constraint "token_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade;`);

    this.addSql(`drop table if exists "genzineers"."token" cascade;`);
  }

}
