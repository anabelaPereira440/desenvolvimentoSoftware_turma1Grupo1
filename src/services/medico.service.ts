import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { CreateMedicoDTO, UpdateMedicoDTO } from '../dtos/medico/create-medico.dto';

export class MedicoService {

    private repo = AppDataSource.getRepository(Medico);

    async listarMedicos(): Promise<Medico[]> {
        return this.repo.find();
    }

    async criarMedico(dados: CreateMedicoDTO): Promise<Medico> {
        // Validação de Texto
        if (!dados.nome || typeof dados.nome !== 'string' || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
            throw new Error("O nome do médico é obrigatório e deve conter apenas letras.");
        }
        if (!dados.especialidade || typeof dados.especialidade !== 'string' || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.especialidade.trim())) {
            throw new Error("A especialidade é obrigatória e deve conter apenas letras.");
        }

        // Validação Numérica
        if (!dados.cedulaProfissional || typeof dados.cedulaProfissional !== 'number') {
            throw new Error("O número da cédula profissional é obrigatório e deve ser numérico.");
        }
        if (!dados.utilizadorId || typeof dados.utilizadorId !== 'number') {
            throw new Error("O ID do utilizador (conta de acesso) é obrigatório.");
        }

        // Validação de Data
        const dataNasc = new Date(dados.dataNascimento);
        if (!dados.dataNascimento || isNaN(dataNasc.getTime())) {
            throw new Error("Data de nascimento é obrigatória e deve ser uma data válida.");
        }

        // Validação de Sexo e Contacto
        if (!dados.sexo || typeof dados.sexo !== 'string' || !['M', 'F'].includes(dados.sexo.toUpperCase())) {
            throw new Error("O sexo é obrigatório (M ou F).");
        }
        if (!dados.contacto || typeof dados.contacto !== 'string' || !/^\d{9}$/.test(dados.contacto.trim())) {
            throw new Error("O contacto é obrigatório e deve conter exatamente 9 dígitos.");
        }
        
        const jaExiste = await this.repo.findOneBy({ cedulaProfissional: dados.cedulaProfissional });
        if (jaExiste) throw new Error("Já existe um médico registado com esta cédula profissional.");

        const novoMedico = new Medico();
        novoMedico.nome = dados.nome.trim();
        novoMedico.especialidade = dados.especialidade.trim();
        novoMedico.cedulaProfissional = dados.cedulaProfissional;
        novoMedico.dataNascimento = new Date(dados.dataNascimento);
        novoMedico.sexo = dados.sexo.toUpperCase();
        novoMedico.contacto = dados.contacto;
        novoMedico.utilizadorId = dados.utilizadorId;

        return this.repo.save(novoMedico);
    }

    async buscarPorId(id: number): Promise<Medico | null> {
        return this.repo.findOneBy({ id });
    }

    async atualizarMedico(id: number, dados: UpdateMedicoDTO): Promise<Medico> {
        const medico = await this.buscarPorId(id);
        if (!medico) throw new Error("Médico não encontrado.");

        this.repo.merge(medico, dados);
        return this.repo.save(medico);
    }

    async eliminarMedico(id: number): Promise<void> {
        const medico = await this.buscarPorId(id);
        if (!medico) throw new Error("Médico não encontrado.");
        await this.repo.remove(medico);
    }
}