import { Request, Response } from 'express';
import { ExameService } from '../services/exame.service';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';

export class ExameController {
    private service = new ExameService();

    // Listar exames — aceita ?utenteId=X para filtrar por utente
    async listar(req: Request, res: Response) {
        try {
            const utenteId = req.query.utenteId ? parseInt(req.query.utenteId as string) : undefined;
            if (utenteId !== undefined && isNaN(utenteId)) {
                return res.status(400).json({ erro: 'O parâmetro utenteId deve ser um número válido.' });
            }
            const exames = await this.service.listarExames(utenteId);
            return res.json(exames);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro interno ao listar exames.', detalhe: error.message });
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const dto: CreateExameDto = req.body;
            const novoExame = await this.service.criarExame(dto);
            return res.status(201).json(novoExame);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
