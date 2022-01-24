import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1643036924665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE place_detail ADD COLUMN kakao_link character varying',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
