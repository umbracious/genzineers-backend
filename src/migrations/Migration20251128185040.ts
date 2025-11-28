import { Migration } from '@mikro-orm/migrations';

export class Migration20251128185040 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "genzineers";`);
    this.addSql(`create table "tag" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(20) not null, constraint "tag_pkey" primary key ("id"));`);

    this.addSql(`create table "genzineers"."user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "full_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text not null default '', constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "genzineers"."course" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "code" varchar(255) not null, "user_id" uuid not null, constraint "course_pkey" primary key ("id"));`);

    this.addSql(`create table "genzineers"."course_tags" ("course_id" uuid not null, "tag_id" uuid not null, constraint "course_tags_pkey" primary key ("course_id", "tag_id"));`);

    this.addSql(`alter table "genzineers"."course" add constraint "course_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade;`);

    this.addSql(`alter table "genzineers"."course_tags" add constraint "course_tags_course_id_foreign" foreign key ("course_id") references "genzineers"."course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "genzineers"."course_tags" add constraint "course_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;`);
  }

}
