import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1655277969082 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    'CREATE TABLE parties(id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,images character varying(257)[], PRIMARY KEY (id))';
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
