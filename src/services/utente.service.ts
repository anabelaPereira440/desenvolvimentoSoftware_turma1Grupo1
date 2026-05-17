import { AppDataSource } from '../database/database';
import { Utente } from '../models/utente.entity';

export class UtenteService {

    private repo = AppDataSource.getRepository(Utente);

    async criarUtente(dados: { nome: string, numeroUtente: number, dataNascimento: Date, sexo: string, contacto:string , medicoId:number }): Promise<Utente> {

        if (!dados.nome || dados.nome.trim() === '') {
            throw new Error("Nome é obrigatório.");
        }

        if(!dados.numeroUtente){
            throw new Error ("Número de utente é obrigatório.")
        }

        if(!dados.dataNascimento){
            throw new Error ("Data de nascimento é obrigatória.")
        }

        if (!dados.contacto || dados.contacto.trim() === '') {
            throw new Error("Contacto é obrigatório.");
        }
      
        const jaExiste = await this.repo.findOneBy({
            numeroUtente: dados.numeroUtente
        });
        if (jaExiste) {
            throw new Error("Já existe um utente igual registado no sistema.");
        }

        const novo = this.repo.create(dados);
        return this.repo.save(novo);
    }

    async listarUtentes(): Promise<Utente[]> {
        return this.repo.find();
    }
}