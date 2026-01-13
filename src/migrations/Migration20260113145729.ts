import { Migration } from '@mikro-orm/migrations';

export class Migration20260113145729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" add column "image" varchar(255) null, add column "start_date" timestamptz null, add column "end_date" timestamptz null;`);

    this.addSql(`alter table "genzineers"."user" drop column "full_name", drop column "email", drop column "password";`);

    this.addSql(`alter table "genzineers"."user" add column "auth_user_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" drop column "image", drop column "start_date", drop column "end_date";`);

    this.addSql(`alter table "genzineers"."user" drop column "auth_user_id";`);

    this.addSql(`alter table "genzineers"."user" add column "full_name" varchar(255) not null, add column "email" varchar(255) not null, add column "password" varchar(255) not null;`);
  }

}
