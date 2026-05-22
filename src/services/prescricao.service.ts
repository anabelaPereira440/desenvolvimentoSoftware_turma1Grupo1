import { AppDataSource } from '../database/database';
import { Prescricao } from '../models/prescricao.entity';
import { CreatePrescricaoDto } from '../dtos/prescricao/create-prescricao.dto';
import { PrescricaoResponseDto } from '../dtos/prescricao/prescricao-response.dto';

export class PrescricaoService {
    private repo = AppDataSource.getRepository(Prescricao);

    //Listar todas as prescrições filtradas pelo DTO de resposta
    async listarPrescricoes(): Promise<PrescricaoResponseDto[]> {
        const prescricoes = await this.repo.find();
        return prescricoes.map((p) => this.toResponseDto(p));
    }

    //Criar prescrição e devolver apenas os dados do DTO de resposta
    async criarPrescricao(dados: CreatePrescricaoDto): Promise<PrescricaoResponseDto> {
        if (!dados.medicamento?.trim()) throw new Error("O nome do medicamento é obrigatório.");
        if (!dados.dose?.trim()) throw new Error("A dose é obrigatória.");
        if (!dados.medico_nome?.trim()) throw new Error("O nome do médico responsável é obrigatório.");
        if (!dados.utenteId) throw new Error("O ID do utente é obrigatório.");

        const dataCriacao = new Date();
        const dataValidade = new Date();
        dataValidade.setDate(dataCriacao.getDate() + 180);
        
        const novaPrescricao = new Prescricao();
        novaPrescricao.medicamento = dados.medicamento;
        novaPrescricao.dose = dados.dose;
        novaPrescricao.medico_nome = dados.medico_nome;
        novaPrescricao.utenteId = dados.utenteId;
        novaPrescricao.dataCriacao = dataCriacao; 
        novaPrescricao.dataValidade = dataValidade;

        const guardada = await this.repo.save(novaPrescricao);
        return this.toResponseDto(guardada);
    }

    // Função auxiliar (Mapper) para transformar a Entity em DTO de Resposta
    private toResponseDto(prescricao: Prescricao): PrescricaoResponseDto {
        return {
            id: prescricao.id,
            medicamento: prescricao.medicamento,
            dose: prescricao.dose,
            medico_nome: prescricao.medico_nome,
            dataValidade: prescricao.dataValidade
        };
    }
}