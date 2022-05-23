import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1653292045985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'ALTER TABLE users ADD COLUMN firebase_token text[]';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
