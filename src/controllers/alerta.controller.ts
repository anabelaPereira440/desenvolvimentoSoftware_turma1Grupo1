import { Request, Response } from 'express';
import { AlertaService } from '.alerta.service'; 
import { AlertaEstado, AlertaPrioridade } from './alerta.entity';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { mapearParaAlertaResponse } from './dto/alerta-response.dto';

export class AlertaController {
    private service = new AlertaService();

    async criar(req: Request, res: Response) {
        try {
            // Tipificamos o corpo da requisição com o teu novo DTO
            const dadosAlerta: CreateAlertaDto = req.body;

            // Validações mínimas obrigatórias na camada HTTP antes de chamar o serviço
            if (!dadosAlerta.utenteId || !dadosAlerta.medicoResponsavelId || !dadosAlerta.tipoGatilho) {
                return res.status(400).json({ 
                    erro: "Os campos utenteId, medicoResponsavelId e tipoGatilho são obrigatórios." 
                });
            }

            const novoAlerta = await this.service.criarAlerta(dadosAlerta);
            
            // Formatamos a resposta usando o teu Mapper para enviar um JSON limpo
            return res.status(201).json({
                mensagem: "Alerta clínico gerado com sucesso.",
                alerta: mapearParaAlertaResponse(novoAlerta)
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    // Listar todos os alertas com filtros opcionais (médico, estado, prioridade)
    async listar(req: Request, res: Response) {
        try {
            const { medicoResponsavelId, estado, prioridade } = req.query;

            // Criamos um objeto de filtros dinâmico
            const filtros: any = {};
            
            if (medicoResponsavelId) filtros.medicoResponsavelId = medicoResponsavelId as string;
            if (estado) filtros.estado = estado as AlertaEstado;
            if (prioridade) filtros.prioridade = prioridade as AlertaPrioridade;

            const alertas = await this.service.listarAlertas(filtros);

            // Convertemos todas as entidades da lista para o formato do AlertaResponseDto
            const respostaFormatada = alertas.map(alerta => mapearParaAlertaResponse(alerta));
            
            return res.json(respostaFormatada);
        } catch (error: any) {
            return res.status(500).json({ 
                erro: "Erro interno ao listar alertas.", 
                detalhe: error.message 
            });
        }
    }

    // Obter um alerta específico pelo seu ID (e ver a sua justificação/detalhes)
    async obterPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID do alerta fornecido deve ser um número válido." });
            }

            const alerta = await this.service.buscarPorId(id);
            if (!alerta) {
                return res.status(404).json({ erro: "Alerta clínico não encontrado." });
            }

            // Aplicamos o Mapper 
            return res.json(mapearParaAlertaResponse(alerta));
        } catch (error: any) {
            return res.status(500).json({ 
                erro: "Erro ao buscar detalhes do alerta.", 
                detalhe: error.message 
            });
        }
    }

    // Listar todos os alertas clínicos pertencentes a um utente específico
    async listarPorUtente(req: Request, res: Response) {
        try {
            const utenteId = parseInt(req.params.utenteId as string);

            if (isNaN(utenteId)) {
                return res.status(400).json({ erro: "O ID do utente fornecido deve ser um número válido." });
            }

            const alertasUtente = await this.service.buscarPorUtente(utenteId);
            
            // Formatamos a lista de respostas
            const respostaFormatada = alertasUtente.map(alerta => mapearParaAlertaResponse(alerta));
            return res.json(respostaFormatada);
        } catch (error: any) {
            return res.status(500).json({ 
                erro: "Erro ao buscar alertas do utente.", 
                detalhe: error.message 
            });
        }
    }

    // Atualizar o estado ou a prioridade de um alerta pelo médico
    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido para atualização deve ser um número válido." });
            }

            const { estado, prioridade } = req.body;

            // Validação manual dos Enums caso sejam enviados no corpo da requisição
            if (estado && !Object.values(AlertaEstado).includes(estado)) {
                return res.status(400).json({ 
                    erro: `Estado inválido. Valores permitidos: ${Object.values(AlertaEstado).join(', ')}` 
                });
            }

            if (prioridade && !Object.values(AlertaPrioridade).includes(prioridade)) {
                return res.status(400).json({ 
                    erro: `Prioridade inválida. Valores permitidos: ${Object.values(AlertaPrioridade).join(', ')}` 
                });
            }

            // Chama o serviço para persistir as alterações na base de dados
            const alertaAtualizado = await this.service.atualizarAlerta(id, { estado, prioridade });
            
           return res.json({ 
                mensagem: "Alerta clínico atualizado com sucesso", 
                alerta: mapearParaAlertaResponse(alertaAtualizado) 
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}