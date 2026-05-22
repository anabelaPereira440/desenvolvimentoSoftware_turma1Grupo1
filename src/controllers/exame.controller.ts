import { Request, Response } from 'express';
import { ExameService } from '../services/exame.service';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';

export class ExameController {
    private service = new ExameService();

    //Listar todos os exames
    async listar(req: Request, res: Response) {
        try {
            const exames = await this.service.listarExames();
            return res.json(exames);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro interno ao listar exames.", detalhe: error.message });
        }
    }

    //Criar novo exame
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