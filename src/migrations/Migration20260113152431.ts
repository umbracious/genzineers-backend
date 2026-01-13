import { Migration } from '@mikro-orm/migrations';

export class Migration20260113152431 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "genzineers"."user" drop column "bio";`);

    this.addSql(`alter table "genzineers"."user" alter column "auth_user_id" type varchar(255) using ("auth_user_id"::varchar(255));`);
    this.addSql(`alter table "genzineers"."user" alter column "auth_user_id" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "genzineers"."user" add column "bio" text not null default '';`);
    this.addSql(`alter table "genzineers"."user" alter column "auth_user_id" type varchar(255) using ("auth_user_id"::varchar(255));`);
    this.addSql(`alter table "genzineers"."user" alter column "auth_user_id" drop not null;`);
  }

}
