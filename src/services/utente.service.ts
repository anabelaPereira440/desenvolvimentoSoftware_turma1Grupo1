import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';
import { CreateUtenteDTO, UpdateUtenteDTO } from '../dtos/utente/create-utente.dto';

export class UtenteService {

    private repo = AppDataSource.getRepository(Utente);

    async listarUtentes(): Promise<Utente[]> {
        return this.repo.find();
    }

    async criarUtente(dados: CreateUtenteDTO): Promise<Utente> {
        // Validação de Texto (Apenas letras e espaços)
        if (!dados.nome || typeof dados.nome !== 'string' || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome.trim())) {
            throw new Error("O nome é obrigatório e deve conter apenas letras.");
        }

        // Validação de Números e IDs
        if (!dados.numeroUtente || typeof dados.numeroUtente !== 'number') {
            throw new Error("O número de utente é obrigatório e deve ser numérico.");
        }
        if (!dados.medicoId || typeof dados.medicoId !== 'number') {
            throw new Error("O ID do médico responsável é obrigatório.");
        }
        if (!dados.utilizadorId || typeof dados.utilizadorId !== 'number') {
            throw new Error("O ID do utilizador (conta de acesso) é obrigatório.");
        }

        // Validação de Data
        const dataNascimento = new Date(dados.dataNascimento);
        if (!dados.dataNascimento || isNaN(dataNascimento.getTime())) {
            throw new Error("Data de nascimento é obrigatória e deve ser uma data válida.");
        }

        // Validação de Sexo
        if (!dados.sexo || typeof dados.sexo !== 'string' || !['M', 'F'].includes(dados.sexo.toUpperCase())) {
            throw new Error("O sexo é obrigatório (M ou F).");
        }

        // Validação de Contacto (exatamente 9 dígitos)
        if (!dados.contacto || typeof dados.contacto !== 'string' || !/^\d{9}$/.test(dados.contacto.trim())) {
            throw new Error("O contacto é obrigatório e deve conter exatamente 9 dígitos.");
        }
        
        const jaExiste = await this.repo.findOneBy({ numeroUtente: dados.numeroUtente });
        if (jaExiste) throw new Error("Já existe um utente igual registado no sistema.");

        const novoUtente = new Utente();
        novoUtente.nome = dados.nome.trim();
        novoUtente.numeroUtente = dados.numeroUtente;
        novoUtente.dataNascimento = new Date(dados.dataNascimento);
        novoUtente.sexo = dados.sexo.toUpperCase();
        novoUtente.contacto = dados.contacto;
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

        this.repo.merge(utente, dados);
        return this.repo.save(utente);
    }

    async eliminarUtente(id: number): Promise<void> {
        const utente = await this.buscarPorId(id);
        if (!utente) throw new Error("Utente não encontrado.");
        await this.repo.remove(utente);
    }
}