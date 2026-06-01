import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.service';

export class UtenteController {
    private service = new UtenteService();

    // Listar utentes — aceita ?medicoId=X ou ?utilizadorId=X
    async listar(req: Request, res: Response) {
        try {
            const medicoId = req.query.medicoId ? parseInt(req.query.medicoId as string) : undefined;
            const utilizadorId = req.query.utilizadorId ? parseInt(req.query.utilizadorId as string) : undefined;
            if (medicoId !== undefined && isNaN(medicoId)) return res.status(400).json({ erro: 'medicoId inválido.' });
            if (utilizadorId !== undefined && isNaN(utilizadorId)) return res.status(400).json({ erro: 'utilizadorId inválido.' });
            const utentes = await this.service.listarUtentes(medicoId, utilizadorId);
            return res.json(utentes);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro interno ao listar utentes.', detalhe: error.message });
        }
    };

    //Criar novo utente
    async criar(req: Request, res: Response) {
        try {
            const novoUtente = await this.service.criarUtente(req.body);
            return res.status(201).json({
                mensagem: `Utente ${novoUtente.nome} registado no sistema`,
                utente: novoUtente
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    //Obter Utente por Id
    async obterPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido deve ser um número válido." });
            }

            const utente = await this.service.buscarPorId(id);
            if (!utente) {
                return res.status(404).json({ erro: "Utente não encontrado." });
            }
            
            return res.json(utente);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao buscar utente.", detalhe: error.message });
        }
    };    

    //Atualizar utente existente
    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido para atualização deve ser um número válido." });
            }

            const utenteAtualizado = await this.service.atualizarUtente(id, req.body);
            return res.json({ mensagem: "Utente atualizado com sucesso", utente: utenteAtualizado });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    };
    
    //Eliminar utente
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido para eliminação deve ser um número válido." });
            }
            await this.service.eliminarUtente(id);
            return res.json({ mensagem: "Utente removido do sistema com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}