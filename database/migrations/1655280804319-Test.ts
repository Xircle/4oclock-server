import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1655280804319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'alter table parties modify column images varchar(257)[]';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
