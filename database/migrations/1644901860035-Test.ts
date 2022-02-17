import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1644901860035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'ALTER TABLE reservations ALTER COLUMN id SET DEFAULT uuid_generate_v4();';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
