import { AppDataSource } from '../database/database';
import { Recomendacao } from '../models/recomendacao.entity';
import { Utente } from '../models/utente.entity';

export class RecomendacaoService {
    private repo = AppDataSource.getRepository(Recomendacao);
    private utenteRepo = AppDataSource.getRepository(Utente);

    async listarPorUtente(utenteId: number): Promise<Recomendacao[]> {
        const utente = await this.utenteRepo.findOneBy({ id: utenteId });
        if (!utente) throw new Error('Utente não encontrado.');

        return this.repo.find({
            where: { utenteId },
            order: { dataCriacao: 'DESC' },
        });
    }

    async marcarComoLida(id: number): Promise<Recomendacao> {
        const recomendacao = await this.repo.findOneBy({ id });
        if (!recomendacao) throw new Error('Recomendação não encontrada.');

        recomendacao.foiLida = true;
        return this.repo.save(recomendacao);
    }
}
