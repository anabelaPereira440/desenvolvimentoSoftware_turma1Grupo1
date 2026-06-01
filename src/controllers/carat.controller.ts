import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';

export class CaratController {
    private service = new CaratService();

    // POST /utente/:id/carat — submeter novo questionário CARAT
    async submeterQuestionario(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.id as string);
            if (isNaN(utenteId)) {
                return res.status(400).json({ erro: 'O ID do utente deve ser um número válido.' });
            }

            const avaliacao = await this.service.criarAvaliacao(utenteId, req.body);

            return res.status(201).json({
                mensagem: 'Questionário CARAT submetido com sucesso!',
                resultado: {
                    id: avaliacao.id,
                    scoreTotal: avaliacao.scoreTotal,
                    subScoreViasSuperiores: avaliacao.subScoreViasSuperiores,
                    subScoreViasInferiores: avaliacao.subScoreViasInferiores,
                    nivelControlo: avaliacao.nivelControlo,
                    interpretacao: avaliacao.interpretacao,
                    recomendacoes: avaliacao.recomendacoes,
                    proximaAvaliacao: avaliacao.proximaAvaliacao,
                    data: avaliacao.data,
                }
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // GET /utente/:id/carat — histórico de avaliações do utente
    async obterHistorico(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.id as string);
            if (isNaN(utenteId)) {
                return res.status(400).json({ erro: 'O ID do utente deve ser um número válido.' });
            }

            const historico = await this.service.listarHistoricoPaciente(utenteId);
            return res.json(historico);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao obter histórico do CARAT.', detalhe: error.message });
        }
    }

    // GET /carat/:evalId — detalhes de uma avaliação específica
    async obterPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.evalId as string);
            if (isNaN(id)) {
                return res.status(400).json({ erro: 'O ID da avaliação deve ser um número válido.' });
            }

            const avaliacao = await this.service.obterPorId(id);
            if (!avaliacao) {
                return res.status(404).json({ erro: 'Avaliação CARAT não encontrada.' });
            }

            return res.json(avaliacao);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao obter avaliação CARAT.', detalhe: error.message });
        }
    }
}
