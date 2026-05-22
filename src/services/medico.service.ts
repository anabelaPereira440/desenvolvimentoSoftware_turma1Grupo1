import { AppDataSource } from '../database/database';
import { Medico } from '../models/medico.entity';
import { CreateMedicoDTO, UpdateMedicoDTO } from '../dtos/medico/create-medico.dto';

export class MedicoService {

    private repo = AppDataSource.getRepository(Medico);

    async listarMedicos(): Promise<Medico[]> {
        return this.repo.find();
    }

    async criarMedico(dados: CreateMedicoDTO): Promise<Medico> {
        if (!dados.nome?.trim()) throw new Error("Nome do médico é obrigatório.");
        if (!dados.especialidade?.trim()) throw new Error("A especialidade é obrigatória.");
        if (!dados.cedulaProfissional) throw new Error("Número da cédula profissional é obrigatório.");
        if (!dados.dataNascimento) throw new Error("Data de nascimento é obrigatória.");
        if (!dados.sexo?.trim()) throw new Error("O sexo é obrigatório.");
        if (!dados.contacto?.trim()) throw new Error("Contacto é obrigatório.");

        const jaExiste = await this.repo.findOneBy({ cedulaProfissional: dados.cedulaProfissional });
        if (jaExiste) throw new Error("Já existe um médico registado com esta cédula profissiona.");

        const novoMedico = this.repo.create({
            ...dados,
            dataNascimento: new Date(dados.dataNascimento)
        });

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