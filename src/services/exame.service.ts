import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';
import { ExameResponseDto } from '../dtos/exame/exame-response.dto';

export class ExameService {
    private repo = AppDataSource.getRepository(Exame);

    // Listar todos os exames no formato do DTO de resposta
    async listarExames(): Promise<ExameResponseDto[]> {
        const exames = await this.repo.find();
        return exames.map((e) => this.toResponseDto(e));
    }

    //Criar exame e devolver apenas os dados do DTO de resposta
    async criarExame(dados: CreateExameDto): Promise<ExameResponseDto> {
        if (!dados.nome?.trim()) throw new Error("O nome do exame é obrigatório.");
        if (!dados.codigo?.trim()) throw new Error("O código do exame é obrigatório.");
        if (!dados.medico_nome?.trim()) throw new Error("O nome do médico requisitante é obrigatório.");
        if (!dados.utenteId) throw new Error("O ID do utente é obrigatório.");

        const dataCriacao = new Date();
        const dataValidade = new Date();
        dataValidade.setDate(dataCriacao.getDate() + 180); // Validade padrão de 6 meses

        const novoExame = new Exame();
        novoExame.nome = dados.nome;
        novoExame.codigo = dados.codigo;
        novoExame.medico_nome = dados.medico_nome;
        novoExame.utenteId = dados.utenteId;
        novoExame.dataCriacao = dataCriacao;
        novoExame.dataValidade = dataValidade;

        const guardado = await this.repo.save(novoExame);
        return this.toResponseDto(guardado);
    }

    // Converter Entity para DTO de Resposta
    private toResponseDto(exame: Exame): ExameResponseDto {
        return {
            id: exame.id,
            nome: exame.nome,
            codigo: exame.codigo,
            medico_nome: exame.medico_nome,
            dataValidade: exame.dataValidade
        };
    }
}