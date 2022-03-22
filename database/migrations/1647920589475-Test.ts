import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1647920589475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'ALTER TABLE event_banners ADD COLUMN main_heading character varying(255)';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
