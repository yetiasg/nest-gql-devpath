import { DataSource } from 'typeorm';
import { databaseConfig, makeConnectionConfig } from './database.config';

const config = databaseConfig();

export default new DataSource(makeConnectionConfig(config));
