import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path:
    process.env.NODE_ENV === 'dev'
      ? '.env.dev'
      : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.prod',
});
export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.{js,ts}'],
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
};
