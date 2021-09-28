import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
});
console.log(process.env.DB_HOST);
console.log(process.env.NODE_ENV);
export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.{js,ts}'],
  ssl:
    process.env.NODE_ENV === 'dev'
      ? false
      : {
          rejectUnauthorized: false,
        },
  synchronize: process.env.NODE_ENV === 'dev' ? true : false,
  logging: true,
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
};
