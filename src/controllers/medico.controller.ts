import { Request, Response } from 'express';
import { MedicoService } from '../services/medico.service';

export class MedicoController {
    private service = new MedicoService();

    // Listar médicos — aceita ?utilizadorId=X
    async listar(req: Request, res: Response) {
        try {
            const utilizadorId = req.query.utilizadorId ? parseInt(req.query.utilizadorId as string) : undefined;
            const medicos = await this.service.listarMedicos(utilizadorId);
            return res.json(medicos);
        } catch (error: any) {
            return res.status(500).json({ erro: 'Erro interno ao listar médicos.', detalhe: error.message });
        }
    };

    //Criar novo médico
    async criar(req: Request, res: Response) {
        try {
            const novoMedico = await this.service.criarMedico(req.body);
            return res.status(201).json({
                mensagem: `Médico ${novoMedico.nome} registado no sistema`,
                medico: novoMedico
            });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    //Obter médico por Id
    async obterPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido deve ser um número válido." });
            }

            const medico = await this.service.buscarPorId(id);
            if (!medico) {
                return res.status(404).json({ erro: "Médico não encontrado." });
            }
            
            return res.json(medico);
        } catch (error: any) {
            return res.status(500).json({ erro: "Erro ao buscar médico.", detalhe: error.message });
        }
    };    

    //Atualizar médico existente
    async atualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);

            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido para atualização deve ser um número válido." });
            }

            const medicoAtualizado = await this.service.atualizarMedico(id, req.body);
            return res.json({ mensagem: "Médico atualizado com sucesso", medico: medicoAtualizado });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    };
    
    //Eliminar médico
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                return res.status(400).json({ erro: "O ID fornecido para eliminação deve ser um número válido." });
            }
            await this.service.eliminarMedico(id);
            return res.json({ mensagem: "Médico removido do sistema com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}