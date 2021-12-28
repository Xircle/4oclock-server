import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import './src/env';
const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  host: process.env.RDS_HOSTNAME,
  port: +process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
  ssl: false,
  synchronize: false,
  logging: process.env.NODE_ENV === 'dev',
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrations: [__dirname + '/database/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  cli: {
    entitiesDir: __dirname + '/**/*.entity.{js,ts}',
    migrationsDir: __dirname + '/database/migrations/',
    subscribersDir: 'src/subscriber',
  },
};
export default ormconfig;
