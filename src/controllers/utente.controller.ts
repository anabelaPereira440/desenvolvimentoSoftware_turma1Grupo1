import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.service';

export class UtenteController {
    private service = new UtenteService();

    async listar(req: Request, res: Response) {
        const utentes = await this.service.listarUtentes();
        return res.json(utentes);
    }

    async obterPorId(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const utente = await this.service.buscarPorId(id);
        if (!utente) return res.status(404).json({ erro: "Utente não encontrado." });
        return res.json(utente);
    }

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

    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const utenteAtualizado = await this.service.atualizarUtente(id, req.body);
            return res.json({ mensagem: "Utente atualizado", utente: utenteAtualizado });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.service.eliminarUtente(id);
            return res.json({ mensagem: "Utente removido do sistema com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}