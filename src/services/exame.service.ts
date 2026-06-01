import { AppDataSource } from '../database/database';
import { Exame } from '../models/exame.entity';
import { TipoExame } from '../enums/TipoExame.enum';
import { CreateExameDto } from '../dtos/exame/create-exame.dto';
import { ExameResponseDto } from '../dtos/exame/exame-response.dto';

export class ExameService {
  private repo = AppDataSource.getRepository(Exame);

  async listarExames(utenteId?: number): Promise<ExameResponseDto[]> {
    const exames = await this.repo.find({
      where: utenteId ? { utenteId } : {},
      order: { dataCriacao: 'DESC' },
    });
    return exames.map((e) => this.toResponseDto(e));
  }

  async criarExame(dados: CreateExameDto): Promise<ExameResponseDto> {
    // Nome do exame
    if (!dados.nome?.trim()) throw new Error("O nome do exame é obrigatório.");
    if (dados.nome.trim().length > 150) throw new Error("O nome do exame não pode exceder 150 caracteres.");

    // Tipo: deve ser valor válido do enum TipoExame
    const tiposValidos = Object.values(TipoExame);
    if (!dados.tipo || !tiposValidos.includes(dados.tipo as TipoExame)) {
      throw new Error(`O tipo de exame é obrigatório. Valores aceites: ${tiposValidos.join(', ')}.`);
    }

    // Código do exame
    if (!dados.codigo?.trim()) throw new Error("O código do exame é obrigatório.");

    // Nome do médico requisitante
    if (!dados.medico_nome?.trim()) throw new Error("O nome do médico requisitante é obrigatório.");

    // Utente
    if (!dados.utenteId || typeof dados.utenteId !== 'number' || dados.utenteId <= 0) {
      throw new Error("O ID do utente é obrigatório e deve ser um número positivo.");
    }

    // Data de validade (opcional — se fornecida, deve ser futura)
    let dataValidade = new Date();
    dataValidade.setDate(dataValidade.getDate() + 180);

    if (dados.dataValidade) {
      const dataValFornecida = new Date(dados.dataValidade);
      if (isNaN(dataValFornecida.getTime())) {
        throw new Error("A data de validade fornecida não é válida.");
      }
      if (dataValFornecida <= new Date()) {
        throw new Error("A data de validade deve ser uma data futura.");
      }
      dataValidade = dataValFornecida;
    }

    const novoExame = new Exame();
    novoExame.nome = dados.nome.trim();
    novoExame.tipo = dados.tipo as TipoExame;
    novoExame.codigo = dados.codigo.trim();
    novoExame.medico_nome = dados.medico_nome.trim();
    novoExame.utenteId = dados.utenteId;
    novoExame.dataValidade = dataValidade;

    const guardado = await this.repo.save(novoExame);
    return this.toResponseDto(guardado);
  }

  private toResponseDto(exame: Exame): ExameResponseDto {
    return {
      id: exame.id,
      nome: exame.nome,
      tipo: exame.tipo,
      codigo: exame.codigo,
      medico_nome: exame.medico_nome,
      utenteId: exame.utenteId,
      dataCriacao: exame.dataCriacao,
      dataValidade: exame.dataValidade,
    };
  }
}
