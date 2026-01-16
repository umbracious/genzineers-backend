import { Migration } from '@mikro-orm/migrations';

export class Migration20260114210440 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "genzineers"."course" drop column "description";`);
  }

}
