import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1655348802855 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'CREATE TABLE parties (id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,created_at timestamp(6) with time zone NOT NULL DEFAULT now(), updated_at timestamp(6) with time zone NOT NULL DEFAULT now());';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
