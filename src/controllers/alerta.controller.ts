import { Request, Response } from 'express';
import { AlertaService } from '../services/alerta.service';
import { AlertaEstado } from '../enums/AlertaEstado.enum';
import { AlertaPrioridade } from '../enums/AlertaPrioridade.enum';
import { CreateAlertaDto, UpdateAlertaDto } from '../dtos/alerta/create-alerta.dto';

export class AlertaController {
    private service = new AlertaService();

    async criar(req: Request, res: Response) {
        try {
            const dadosAlerta: CreateAlertaDto = req.body;

            if (!dadosAlerta.utenteId || !dadosAlerta.medicoResponsavelId || !dadosAlerta.tipoAlerta) {
                return res.status(400).json({
                    erro: 'Os campos utenteId, medicoResponsavelId e tipoAlerta são obrigatórios.'
                });
            }

            const novoAlerta = await this.service.criarAlerta(dadosAlerta);
            return res.status(201).json({ mensagem: 'Alerta clínico gerado com sucesso.', alerta: novoAlerta });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const { medicoResponsavelId, estado, prioridade } = req.query;
            const filtros: any = {};
            if (medicoResponsavelId) filtros.medicoResponsavelId = parseInt(medicoResponsavelId as string);
            if (estado)     filtros.estado     = estado     as AlertaEstado;
            if (prioridade) filtros.prioridade = prioridade as AlertaPrioridade;

            const alertas = await this.service.listarAlertas(filtros);
            return res.json(alertas);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro interno ao listar alertas.', detalhe: error.message });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) return res.status(400).json({ erro: 'O ID do alerta deve ser um número válido.' });

            const alerta = await this.service.buscarPorId(id);
            if (!alerta) return res.status(404).json({ erro: 'Alerta clínico não encontrado.' });

            return res.json(alerta);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao buscar detalhes do alerta.', detalhe: error.message });
        }
    }

    async listarPorUtente(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.utenteId as string);
            if (isNaN(utenteId)) return res.status(400).json({ erro: 'O ID do utente deve ser um número válido.' });

            const alertas = await this.service.buscarPorUtente(utenteId);
            return res.json(alertas);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro ao buscar alertas do utente.', detalhe: error.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) return res.status(400).json({ erro: 'O ID do alerta deve ser um número válido.' });

            const dados: UpdateAlertaDto = req.body;

            if (dados.estado && !Object.values(AlertaEstado).includes(dados.estado)) {
                return res.status(400).json({
                    erro: `Estado inválido. Valores permitidos: ${Object.values(AlertaEstado).join(', ')}`
                });
            }
            if (dados.prioridade && !Object.values(AlertaPrioridade).includes(dados.prioridade)) {
                return res.status(400).json({
                    erro: `Prioridade inválida. Valores permitidos: ${Object.values(AlertaPrioridade).join(', ')}`
                });
            }

            const alertaAtualizado = await this.service.atualizarAlerta(id, dados);
            return res.json({ mensagem: 'Alerta clínico atualizado com sucesso.', alerta: alertaAtualizado });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
