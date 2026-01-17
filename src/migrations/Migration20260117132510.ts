import { Migration } from '@mikro-orm/migrations';

export class Migration20260117132510 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "genzineers"."course_tags" drop constraint "course_tags_tag_id_foreign";`);

    this.addSql(`drop table if exists "tag" cascade;`);

    this.addSql(`drop table if exists "genzineers"."course_tags" cascade;`);

    this.addSql(`drop table if exists "genzineers"."token" cascade;`);

    this.addSql(`alter table "genzineers"."course" add column "tutor" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "tag" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(20) not null, constraint "tag_pkey" primary key ("id"));`);

    this.addSql(`create table "genzineers"."course_tags" ("course_id" uuid not null, "tag_id" uuid not null, constraint "course_tags_pkey" primary key ("course_id", "tag_id"));`);

    this.addSql(`create table "genzineers"."token" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "token_hash" varchar(255) not null, "device" varchar(255) null, "ip" varchar(255) null, "expires_at" timestamptz null, "revoked" boolean null default false, constraint "token_pkey" primary key ("id"));`);

    this.addSql(`alter table "genzineers"."course_tags" add constraint "course_tags_course_id_foreign" foreign key ("course_id") references "genzineers"."course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "genzineers"."course_tags" add constraint "course_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "genzineers"."token" add constraint "token_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade;`);

    this.addSql(`alter table "genzineers"."course" drop column "tutor";`);
  }

}
