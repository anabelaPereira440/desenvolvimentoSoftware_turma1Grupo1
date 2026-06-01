import { Request, Response } from 'express';
import { PrescricaoService } from '../services/prescricao.service';
import { CreatePrescricaoDto } from '../dtos/prescricao/create-prescricao.dto';

export class PrescricaoController {
    private service = new PrescricaoService();

    // Listar prescrições — aceita ?utenteId=X para filtrar por utente
    async listar(req: Request, res: Response) {
        try {
            const utenteId = req.query.utenteId ? parseInt(req.query.utenteId as string) : undefined;
            if (utenteId !== undefined && isNaN(utenteId)) {
                return res.status(400).json({ erro: 'O parâmetro utenteId deve ser um número válido.' });
            }
            const prescricoes = await this.service.listarPrescricoes(utenteId);
            return res.json(prescricoes);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro interno ao listar prescrições.', detalhe: error.message });
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const dto: CreatePrescricaoDto = req.body;
            const novaPrescricao = await this.service.criarPrescricao(dto);
            return res.status(201).json(novaPrescricao);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
