import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1640771233821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE places ADD COLUMN place_type place_type_enum DEFAULT 'All'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
