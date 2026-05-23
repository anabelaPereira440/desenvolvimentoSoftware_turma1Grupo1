import { Request, Response } from 'express';
import { CaratService } from '../services/carat.service';

export class CaratController {
    private service = new CaratService();

    // POST /patients/:id/carat -> Submeter um novo questionário
    async submeterQuestionario(req: Request, res: Response) {
        try {
            // Extrai o ID do utente do URL e converte para número
            const utenteId = parseInt(req.params.id as string);
            
            if (isNaN(utenteId)) {
                return res.status(400).json({ erro: "O ID do utente deve ser um número válido." });
            }

            // Chama o serviço passando os dados recebidos do formulário (req.body)
            const avaliacao = await this.service.criarAvaliacao(utenteId, req.body);
            
            // Devolve uma resposta formatada em JSON com status 201 (Created)
            return res.status(201).json({
                mensagem: "Questionário CARAT submetido com sucesso!",
                resultado: {
                    id: avaliacao.id,
                    scoreTotal: avaliacao.scoreTotal,
                    viasSuperiores: avaliacao.subScoreViasSuperiores,
                    viasInferiores: avaliacao.subScoreViasInferiores,
                    interpretacao: avaliacao.interpretacao,
                    recomendacoes: avaliacao.recomendacoes,
                    data: avaliacao.data
                }
            });
        } catch (error: any) {
            // Se houver algum erro de validação no Service, ele é capturado aqui
            return res.status(400).json({ erro: error.message });
        }
    }

    // GET /patients/:id/carat -> Obter o histórico de avaliações do paciente
    async obterHistorico(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.id as string);
            
            if (isNaN(utenteId)) {
                return res.status(400).json({ erro: "O ID do utente deve ser um número válido." });
            }

            // Vai buscar a lista de todas as avaliações passadas do utente
            const historico = await this.service.listarHistoricoPaciente(utenteId);
            return res.json(historico);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao obter histórico do CARAT.", detalhe: error.message });
        }
    }
}