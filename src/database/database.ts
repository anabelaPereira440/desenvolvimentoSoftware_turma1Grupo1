import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Prescricao } from '../models/prescricao.entity';
import { Exame } from '../models/exame.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [User, Utente, Medico, Prescricao, Exame],
    synchronize: true,
});