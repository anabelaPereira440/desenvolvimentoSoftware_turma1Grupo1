import { Request, Response } from 'express';
import { UtenteService } from '../services/utente.service';

export class UtenteController {
    private service = new UtenteService();

    async listar(req: Request, res: Response) {
        const utentes = await this.service.listarUtentes();
        return res.json(utentes);
    }

    async criar(req: Request, res: Response) {
        try {
            const { nome, numeroUtente, dataNascimento, sexo, contacto, medicoId } = req.body;

            const novoUtente = await this.service.criarUtente({ nome, numeroUtente, dataNascimento, sexo, contacto, medicoId });

            return res.status(201).json({
                mensagem: `Utente ${novoUtente.nome} registado no sistema`,
                utente: novoUtente
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}