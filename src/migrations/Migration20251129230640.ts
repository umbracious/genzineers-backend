import { Migration } from '@mikro-orm/migrations';

export class Migration20251129230640 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "genzineers"."course_users" ("course_id" uuid not null, "user_id" uuid not null, constraint "course_users_pkey" primary key ("course_id", "user_id"));`);

    this.addSql(`alter table "genzineers"."course_users" add constraint "course_users_course_id_foreign" foreign key ("course_id") references "genzineers"."course" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "genzineers"."course_users" add constraint "course_users_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "genzineers"."course" drop constraint "course_user_id_foreign";`);

    this.addSql(`alter table "genzineers"."course" drop column "user_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "genzineers"."course_users" cascade;`);

    this.addSql(`alter table "genzineers"."course" add column "user_id" uuid not null;`);
    this.addSql(`alter table "genzineers"."course" add constraint "course_user_id_foreign" foreign key ("user_id") references "genzineers"."user" ("id") on update cascade;`);
  }

}
