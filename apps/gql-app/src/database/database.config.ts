import { ConfigType, registerAs } from '@nestjs/config';
import * as path from 'path';
import type { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 5432),
  database: process.env.DB_DATABASE ?? 'postgres',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
}));

export type DatabaseConfigType = ConfigType<typeof databaseConfig>;

export const makeConnectionConfig = (
  config: DatabaseConfigType,
): DataSourceOptions => ({
  type: 'postgres',
  ...config,
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/*.{j,t}s')],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: true,
});
