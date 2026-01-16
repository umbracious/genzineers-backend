import { Migration } from '@mikro-orm/migrations';

export class Migration20260114113520 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" add column "link" varchar(255) null;`);

    this.addSql(`create index "user_auth_user_id_index" on "genzineers"."user" ("auth_user_id");`);
    this.addSql(`alter table "genzineers"."user" add constraint "user_auth_user_id_unique" unique ("auth_user_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" drop column "link";`);

    this.addSql(`drop index "genzineers"."user_auth_user_id_index";`);
    this.addSql(`alter table "genzineers"."user" drop constraint "user_auth_user_id_unique";`);
  }

}
