import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { CreateUtenteDTO, UpdateUtenteDTO } from '../dtos/utente/create-utente.dto';

export class UtenteService {

    private repo = AppDataSource.getRepository(Utente);

    async listarUtentes(): Promise<Utente[]> {
        return this.repo.find();
    }

    async criarUtente(dados: CreateUtenteDTO): Promise<Utente> {
        if (!dados.nome?.trim()) throw new Error("Nome é obrigatório.");
        if (!dados.numeroUtente) throw new Error("Número de utente é obrigatório.");
        if (!dados.dataNascimento) throw new Error("Data de nascimento é obrigatória.");
        if (!dados.sexo?.trim()) throw new Error("O sexo é obrigatório.");
        if (!dados.contacto?.trim()) throw new Error("Contacto é obrigatório.");
        if (!dados.medicoId) throw new Error("O ID do médico responsável é obrigatório.");

        const jaExiste = await this.repo.findOneBy({ numeroUtente: dados.numeroUtente });
        if (jaExiste) throw new Error("Já existe um utente igual registado no sistema.");

        const novoUtente = this.repo.create({
            ...dados,
            dataNascimento: new Date(dados.dataNascimento)
        });

        return this.repo.save(novoUtente);
    }

    async buscarPorId(id: number): Promise<Utente | null> {
        return this.repo.findOneBy({ id });
    }

    async atualizarUtente(id: number, dados: UpdateUtenteDTO): Promise<Utente> {
        const utente = await this.buscarPorId(id);
        if (!utente) throw new Error("Utente não encontrado.");

        this.repo.merge(utente, dados);
        return this.repo.save(utente);
    }

    async eliminarUtente(id: number): Promise<void> {
        const utente = await this.buscarPorId(id);
        if (!utente) throw new Error("Utente não encontrado.");
        await this.repo.remove(utente);
    }
}