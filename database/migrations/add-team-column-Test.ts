import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1643035618076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user_profiles ADD COLUMN team character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
