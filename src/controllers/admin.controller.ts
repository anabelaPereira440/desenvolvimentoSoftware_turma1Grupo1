import { Request, Response } from 'express';
import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Alerta } from '../models/alerta.entity';
import { Prescricao } from '../models/prescricao.entity';
import { Exame } from '../models/exame.entity';
import { Log } from '../models/log.entity';

export class AdminController {
    // DELETE /admin/simulados — limpa todos os dados clínicos (mantém utilizadores, utentes, médicos e configuração)
    async limparSimulados(req: Request, res: Response) {
        try {
            await AppDataSource.getRepository(Alerta).delete({});
            await AppDataSource.getRepository(AvaliacaoCarat).delete({});
            await AppDataSource.getRepository(Prescricao).delete({});
            await AppDataSource.getRepository(Exame).delete({});
            await AppDataSource.getRepository(Log).delete({});
            return res.json({ mensagem: 'Dados clínicos simulados eliminados com sucesso.' });
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao limpar dados simulados.', detalhe: error.message });
        }
    }
}
