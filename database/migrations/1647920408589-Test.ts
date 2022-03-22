import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1647920408589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'ALTER TABLE event_banners ADD COLUMN main_heading VARCHAR(255), ADD COLUMN sub_heading VARCHAR(255);';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
