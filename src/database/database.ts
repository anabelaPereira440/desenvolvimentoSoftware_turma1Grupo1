import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Utilizador } from '../models/utilizador.entity';
import { Utente } from '../models/utente.entity';
import { Medico } from '../models/medico.entity';
import { Prescricao } from '../models/prescricao.entity';
import { Exame } from '../models/exame.entity';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Alerta } from '../models/alerta.entity';
import { Recomendacao } from '../models/recomendacao.entity';
import { Configuracao } from '../models/configuracao.entity';
import { Log } from '../models/log.entity';

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'data.db',
    entities: [Utilizador, Utente, Medico, Prescricao, Exame, AvaliacaoCarat, Alerta, Recomendacao, Configuracao, Log],
    synchronize: true,
});