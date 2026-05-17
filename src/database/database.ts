import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Utente } from '../models/utente.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [Utente],
    synchronize: true,
});