import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { Utilizador } from '../models/utilizador.entity';
import { SexoBiologico } from '../enums/SexoBiologico.enum';
import { CreateUtenteDTO, UpdateUtenteDTO } from '../dtos/utente/create-utente.dto';

export class UtenteService {

  private repo = AppDataSource.getRepository(Utente);
  private repoUtil = AppDataSource.getRepository(Utilizador);

  async listarUtentes(medicoId?: number, utilizadorId?: number): Promise<Utente[]> {
    if (medicoId) {
      if (typeof medicoId !== 'number' || medicoId <= 0) throw new Error('O ID do médico deve ser um número positivo.');
      return this.repo.find({ where: { medicoId } });
    }
    if (utilizadorId) {
      if (typeof utilizadorId !== 'number' || utilizadorId <= 0) throw new Error('O ID do utilizador deve ser um número positivo.');
      return this.repo.find({ where: { utilizadorId } });
    }
    return this.repo.find();
  }

  async criarUtente(dados: CreateUtenteDTO): Promise<Utente> {
    // Nome: obrigatório, apenas letras e espaços
    if (!dados.nome || typeof dados.nome !== 'string' || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
      throw new Error("O nome é obrigatório e deve conter apenas letras.");
    }
    if (dados.nome.trim().length < 2 || dados.nome.trim().length > 100) {
      throw new Error("O nome deve ter entre 2 e 100 caracteres.");
    }

    // Número de utente: exatamente 9 dígitos
    if (!dados.numeroUtente || typeof dados.numeroUtente !== 'number') {
      throw new Error("O número de utente é obrigatório e deve ser numérico.");
    }
    if (!/^\d{9}$/.test(String(dados.numeroUtente))) {
      throw new Error("O número de utente deve ter exatamente 9 dígitos.");
    }

    // Data de nascimento: válida e no passado
    const dataNascimento = new Date(dados.dataNascimento);
    if (!dados.dataNascimento || isNaN(dataNascimento.getTime())) {
      throw new Error("Data de nascimento é obrigatória e deve ser uma data válida.");
    }
    if (dataNascimento >= new Date()) {
      throw new Error("A data de nascimento deve ser no passado.");
    }

    // Sexo: deve ser um valor válido do enum SexoBiologico
    const sexosValidos = Object.values(SexoBiologico);
    if (!dados.sexo || !sexosValidos.includes(dados.sexo as SexoBiologico)) {
      throw new Error(`O sexo é obrigatório. Valores aceites: ${sexosValidos.join(', ')}.`);
    }

    // Contacto: exatamente 9 dígitos
    if (!dados.contacto || typeof dados.contacto !== 'string' || !/^\d{9}$/.test(dados.contacto.trim())) {
      throw new Error("O contacto é obrigatório e deve conter exatamente 9 dígitos.");
    }

    // IDs de referência
    if (!dados.medicoId || typeof dados.medicoId !== 'number' || dados.medicoId <= 0) {
      throw new Error("O ID do médico responsável é obrigatório e deve ser um número positivo.");
    }
    if (!dados.utilizadorId || typeof dados.utilizadorId !== 'number' || dados.utilizadorId <= 0) {
      throw new Error("O ID do utilizador (conta de acesso) é obrigatório e deve ser um número positivo.");
    }

    const jaExiste = await this.repo.findOneBy({ numeroUtente: dados.numeroUtente });
    if (jaExiste) throw new Error("Já existe um utente com este número de utente registado no sistema.");

    const novoUtente = new Utente();
    novoUtente.nome = dados.nome.trim();
    novoUtente.numeroUtente = dados.numeroUtente;
    novoUtente.dataNascimento = dataNascimento;
    novoUtente.sexo = dados.sexo as SexoBiologico;
    novoUtente.contacto = dados.contacto.trim();
    novoUtente.medicoId = dados.medicoId;
    novoUtente.utilizadorId = dados.utilizadorId;

    return this.repo.save(novoUtente);
  }

  async buscarPorId(id: number): Promise<Utente | null> {
    return this.repo.findOneBy({ id });
  }

  async atualizarUtente(id: number, dados: UpdateUtenteDTO): Promise<Utente> {
    const utente = await this.buscarPorId(id);
    if (!utente) throw new Error("Utente não encontrado.");

    if (dados.nome !== undefined) {
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
        throw new Error("O nome deve conter apenas letras.");
      }
      if (dados.nome.trim().length < 2 || dados.nome.trim().length > 100) {
        throw new Error("O nome deve ter entre 2 e 100 caracteres.");
      }
      utente.nome = dados.nome.trim();
    }

    if (dados.contacto !== undefined) {
      if (!/^\d{9}$/.test(dados.contacto.trim())) {
        throw new Error("O contacto deve conter exatamente 9 dígitos.");
      }
      utente.contacto = dados.contacto.trim();
    }

    if (dados.medicoId !== undefined) {
      if (typeof dados.medicoId !== 'number' || dados.medicoId <= 0) {
        throw new Error("O ID do médico deve ser um número positivo.");
      }
      utente.medicoId = dados.medicoId;
    }

    return this.repo.save(utente);
  }

  async eliminarUtente(id: number): Promise<void> {
    const utente = await this.buscarPorId(id);
    if (!utente) throw new Error("Utente não encontrado.");
    const utilizadorId = utente.utilizadorId;
    await this.repo.remove(utente);
    await this.repoUtil.delete(utilizadorId);
  }
}
