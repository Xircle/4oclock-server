import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1653291981165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'ALTER TABLE users DROP COLUMN firebase_token';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
