import { AppDataSource } from '../database/database';
import { Prescricao } from '../models/prescricao.entity';
import { ViaAdministracao } from '../enums/ViaAdministracao.enum';
import { CreatePrescricaoDto } from '../dtos/prescricao/create-prescricao.dto';
import { PrescricaoResponseDto } from '../dtos/prescricao/prescricao-response.dto';

export class PrescricaoService {
  private repo = AppDataSource.getRepository(Prescricao);

  async listarPrescricoes(utenteId?: number): Promise<PrescricaoResponseDto[]> {
    const prescricoes = await this.repo.find({
      where: utenteId ? { utenteId } : {},
      order: { dataCriacao: 'DESC' },
    });
    return prescricoes.map((p) => this.toResponseDto(p));
  }

  async criarPrescricao(dados: CreatePrescricaoDto): Promise<PrescricaoResponseDto> {
    // Medicamento
    if (!dados.medicamento?.trim()) throw new Error("O nome do medicamento é obrigatório.");
    if (dados.medicamento.trim().length > 200) throw new Error("O nome do medicamento não pode exceder 200 caracteres.");

    // Dose
    if (!dados.dose?.trim()) throw new Error("A dose é obrigatória.");
    if (dados.dose.trim().length > 100) throw new Error("A dose não pode exceder 100 caracteres.");

    // Via de administração: deve ser valor válido do enum ViaAdministracao
    const viasValidas = Object.values(ViaAdministracao);
    if (!dados.viaAdministracao || !viasValidas.includes(dados.viaAdministracao as ViaAdministracao)) {
      throw new Error(`A via de administração é obrigatória. Valores aceites: ${viasValidas.join(', ')}.`);
    }

    // Nome do médico prescritor
    if (!dados.medico_nome?.trim()) throw new Error("O nome do médico responsável é obrigatório.");

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

    const novaPrescricao = new Prescricao();
    novaPrescricao.medicamento = dados.medicamento.trim();
    novaPrescricao.dose = dados.dose.trim();
    novaPrescricao.viaAdministracao = dados.viaAdministracao as ViaAdministracao;
    novaPrescricao.medico_nome = dados.medico_nome.trim();
    novaPrescricao.utenteId = dados.utenteId;
    novaPrescricao.dataValidade = dataValidade;

    const guardada = await this.repo.save(novaPrescricao);
    return this.toResponseDto(guardada);
  }

  private toResponseDto(prescricao: Prescricao): PrescricaoResponseDto {
    return {
      id: prescricao.id,
      medicamento: prescricao.medicamento,
      dose: prescricao.dose,
      viaAdministracao: prescricao.viaAdministracao,
      medico_nome: prescricao.medico_nome,
      utenteId: prescricao.utenteId,
      dataCriacao: prescricao.dataCriacao,
      dataValidade: prescricao.dataValidade,
    };
  }
}
