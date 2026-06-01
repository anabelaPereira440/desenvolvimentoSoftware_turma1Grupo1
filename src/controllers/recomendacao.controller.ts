import { Request, Response } from 'express';
import { RecomendacaoService } from '../services/recomendacao.service';

export class RecomendacaoController {
    private service = new RecomendacaoService();

    async listarPorUtente(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.utenteId as string);
            if (isNaN(utenteId) || utenteId <= 0) {
                return res.status(400).json({ erro: 'O ID do utente deve ser um número válido.' });
            }

            const recomendacoes = await this.service.listarPorUtente(utenteId);
            return res.json(recomendacoes);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async marcarComoLida(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                return res.status(400).json({ erro: 'O ID da recomendação deve ser um número válido.' });
            }

            const atualizada = await this.service.marcarComoLida(id);
            return res.json({ mensagem: 'Recomendação marcada como lida.', recomendacao: atualizada });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
