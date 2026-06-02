import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { SexoBiologico } from '../enums/SexoBiologico.enum';
import { EspecialidadeMedica } from '../enums/EspecialidadeMedica.enum';
import { CreateMedicoDTO, UpdateMedicoDTO } from '../dtos/medico/create-medico.dto';

export class MedicoService {

  private repo = AppDataSource.getRepository(Medico);

  async listarMedicos(utilizadorId?: number): Promise<Medico[]> {
    if (utilizadorId) return this.repo.find({ where: { utilizadorId } });
    return this.repo.find();
  }

  async criarMedico(dados: CreateMedicoDTO): Promise<Medico> {
    // Nome: obrigatório, apenas letras e espaços
    if (!dados.nome || typeof dados.nome !== 'string' || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
      throw new Error("O nome do médico é obrigatório e deve conter apenas letras.");
    }
    if (dados.nome.trim().length < 2 || dados.nome.trim().length > 100) {
      throw new Error("O nome deve ter entre 2 e 100 caracteres.");
    }

    // Especialidade: deve ser um valor válido do enum EspecialidadeMedica
    const especialidadesValidas = Object.values(EspecialidadeMedica);
    if (!dados.especialidade || !especialidadesValidas.includes(dados.especialidade as EspecialidadeMedica)) {
      throw new Error(`A especialidade é obrigatória. Valores aceites: ${especialidadesValidas.join(', ')}.`);
    }

    // Cédula profissional: número positivo
    if (!dados.cedulaProfissional || typeof dados.cedulaProfissional !== 'number' || dados.cedulaProfissional <= 0) {
      throw new Error("O número da cédula profissional é obrigatório e deve ser um número positivo.");
    }

    // Data de nascimento: válida e no passado
    const dataNasc = new Date(dados.dataNascimento);
    if (!dados.dataNascimento || isNaN(dataNasc.getTime())) {
      throw new Error("Data de nascimento é obrigatória e deve ser uma data válida.");
    }
    if (dataNasc >= new Date()) {
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

    if (!dados.utilizadorId || typeof dados.utilizadorId !== 'number' || dados.utilizadorId <= 0) {
      throw new Error("O ID do utilizador (conta de acesso) é obrigatório e deve ser um número positivo.");
    }

    const jaExiste = await this.repo.findOneBy({ cedulaProfissional: dados.cedulaProfissional });
    if (jaExiste) throw new Error("Já existe um médico registado com esta cédula profissional.");

    const novoMedico = new Medico();
    novoMedico.nome = dados.nome.trim();
    novoMedico.especialidade = dados.especialidade as EspecialidadeMedica;
    novoMedico.cedulaProfissional = dados.cedulaProfissional;
    novoMedico.dataNascimento = dataNasc;
    novoMedico.sexo = dados.sexo as SexoBiologico;
    novoMedico.contacto = dados.contacto.trim();
    novoMedico.utilizadorId = dados.utilizadorId;

    return this.repo.save(novoMedico);
  }

  async buscarPorId(id: number): Promise<Medico | null> {
    return this.repo.findOneBy({ id });
  }

  async atualizarMedico(id: number, dados: UpdateMedicoDTO): Promise<Medico> {
    const medico = await this.buscarPorId(id);
    if (!medico) throw new Error("Médico não encontrado.");

    if (dados.nome !== undefined) {
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
        throw new Error("O nome deve conter apenas letras.");
      }
      if (dados.nome.trim().length < 2 || dados.nome.trim().length > 100) {
        throw new Error("O nome deve ter entre 2 e 100 caracteres.");
      }
      medico.nome = dados.nome.trim();
    }

    if (dados.especialidade !== undefined) {
      const especialidadesValidas = Object.values(EspecialidadeMedica);
      if (!especialidadesValidas.includes(dados.especialidade as EspecialidadeMedica)) {
        throw new Error(`Especialidade inválida. Valores aceites: ${especialidadesValidas.join(', ')}.`);
      }
      medico.especialidade = dados.especialidade as EspecialidadeMedica;
    }

    if (dados.cedulaProfissional !== undefined) {
      if (typeof dados.cedulaProfissional !== 'number' || dados.cedulaProfissional <= 0) {
        throw new Error("A cédula profissional deve ser um número positivo.");
      }
      const jaExiste = await this.repo.findOneBy({ cedulaProfissional: dados.cedulaProfissional });
      if (jaExiste && jaExiste.id !== id) throw new Error("Já existe um médico registado com esta cédula profissional.");
      medico.cedulaProfissional = dados.cedulaProfissional;
    }

    if (dados.contacto !== undefined) {
      if (!/^\d{9}$/.test(dados.contacto.trim())) {
        throw new Error("O contacto deve conter exatamente 9 dígitos.");
      }
      medico.contacto = dados.contacto.trim();
    }

    return this.repo.save(medico);
  }

  async eliminarMedico(id: number): Promise<void> {
    const medico = await this.buscarPorId(id);
    if (!medico) throw new Error("Médico não encontrado.");
    await this.repo.remove(medico);
  }
}
