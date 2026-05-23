import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Utente } from '../models/utente.entity';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';

export class CaratService {
    private caratRepository = AppDataSource.getRepository(AvaliacaoCarat);
    private utenteRepository = AppDataSource.getRepository(Utente);

    async criarAvaliacao(utenteId: number, dados: CreateCaratDto): Promise<AvaliacaoCarat> {
        // Validações de input individuais (A lógica condicional que salvaguarda a introdução de texto/valores)
        const perguntas = [dados.p1, dados.p2, dados.p3, dados.p4, dados.p5, dados.p6, dados.p7, dados.p8, dados.p9, dados.p10];
        
        for (let i = 0; i < perguntas.length; i++) {
            const nota = perguntas[i];
            if (nota === undefined || nota === null || nota < 0 || nota > 3 || isNaN(nota)) {
                throw new Error(`A pergunta ${i + 1} deve conter um valor numérico válido entre 0 e 3.`);
            }
        }

        const utenteExiste = await this.utenteRepository.findOneBy({ id: utenteId });
        if (!utenteExiste) {
            throw new Error("Utente não encontrado no sistema.");
        }

        // Lógica matemática
        const subScoreViasSuperiores = dados.p1 + dados.p2 + dados.p3 + dados.p4;
        const subScoreViasInferiores = dados.p5 + dados.p6 + dados.p7 + dados.p8 + dados.p9 + dados.p10;
        const scoreTotal = subScoreViasSuperiores + subScoreViasInferiores;

        let interpretacao = "";
        let recomendacoes = "";

        if (scoreTotal < 19) {
            interpretacao = "Doença Respiratória Não Controlada (Controlo Insuficiente).";
            recomendacoes = "Revisão terapêutica urgente com o seu médico. Reforçar medidas de autocuidado e vigilância de sintomas severos.";
        } else if (scoreTotal >= 19 && scoreTotal <= 24) {
            interpretacao = "Doença Respiratória Parcialmente Controlada.";
            recomendacoes = "Manter o plano terapêutico habitual e agendar uma consulta de rotina para avaliação contívua.";
        } else {
            interpretacao = "Doença Respiratória Controlada.";
            recomendacoes = "Excelente estado clínico! Continue com o plano prescrito. Próxima avaliação sugerida em 3 meses.";
        }

        
        const novaAvaliacao = new AvaliacaoCarat();
        novaAvaliacao.utenteId = utenteId;
        novaAvaliacao.data = new Date();
        
        novaAvaliacao.p1 = dados.p1;
        novaAvaliacao.p2 = dados.p2;
        novaAvaliacao.p3 = dados.p3;
        novaAvaliacao.p4 = dados.p4;
        novaAvaliacao.p5 = dados.p5;
        novaAvaliacao.p6 = dados.p6;
        novaAvaliacao.p7 = dados.p7;
        novaAvaliacao.p8 = dados.p8;
        novaAvaliacao.p9 = dados.p9;
        novaAvaliacao.p10 = dados.p10;

        novaAvaliacao.scoreTotal = scoreTotal;
        novaAvaliacao.subScoreViasSuperiores = subScoreViasSuperiores;
        novaAvaliacao.subScoreViasInferiores = subScoreViasInferiores;
        novaAvaliacao.interpretacao = interpretacao;
        novaAvaliacao.recomendacoes = recomendacoes;

        return await this.caratRepository.save(novaAvaliacao);
    }

    async listarHistoricoPaciente(utenteId: number): Promise<AvaliacaoCarat[]> {
        const utenteExiste = await this.utenteRepository.findOneBy({ id: utenteId });
        if (!utenteExiste) {
            throw new Error("Utente não encontrado.");
        }

        return await this.caratRepository.find({
            where: { utenteId },
            order: { data: 'DESC' }
        });
    }
}