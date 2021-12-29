import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1640766854205 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE place_type_enum AS ENUM ('All', 'Regular meeting', 'Lightning', 'Event')",
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE place_type_enum');
  }
}
