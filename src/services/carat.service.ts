import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Utente } from '../models/utente.entity';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { AlertaService } from './alerta.service'; // 1. Importa o AlertaService
import { TipoAlerta, AlertaPrioridade } from '../models/alerta.entity'; // 2. Importa os enums do Alerta

export class CaratService {
    private caratRepository = AppDataSource.getRepository(AvaliacaoCarat);
    private utenteRepository = AppDataSource.getRepository(Utente);
    private alertaService = new AlertaService(); // 3. Inicializa o serviço de alertas

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
            recomendacoes = "Indicação para a realização de exames complementares de diagnóstico. Manter o plano terapêutico habitual e agendar uma consulta de rotina para avaliação contívua.";
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
        // Guarda a avaliação no banco de dados primeiro
        const avaliacaoSalva = await this.caratRepository.save(novaAvaliacao);

        //GATILHO AUTOMÁTICO: Se o score for crítico (< 19), gera um alerta clínico
        if (scoreTotal < 19) {
            try {
                // Descobre dinamicamente qual é o médico deste utente (ou assume o "1" como fallback)
                const medicoId = utenteExiste.medicoId ? String(utenteExiste.medicoId) : "1";

                await this.alertaService.criarAlerta({
                    utenteId: utenteId,
                    medicoResponsavelId: medicoId,
                    tipoAlerta: TipoAlerta.REVISAOTERAPEUTICA, // Identifica o tipo correto para o BeforeInsert
                    prioridade: AlertaPrioridade.ALTA,         // Score crítico exige prioridade ALTA
                    avaliacaoCaratId: String(avaliacaoSalva.id) // Vincula o alerta a esta avaliação específica
                });
                
                console.log(`[Gatilho Automático] Alerta REVISAOTERAPEUTICA criado para o utente ID: ${utenteId}`);
            } catch (erroAlerta) {
                // Bloco catch isolado para garantir que, se a criação automática do alerta falhar,
                // o utilizador não perde o registo do exame CARAT que acabou de fazer.
                console.error("Erro ao gerar o alerta automático de CARAT:", erroAlerta);
            }
        } else if (scoreTotal >= 19 && scoreTotal <= 24) {
            try {
                const medicoId = utenteExiste.medicoId ? String(utenteExiste.medicoId) : "1";

                await this.alertaService.criarAlerta({
                    utenteId: utenteId,
                    medicoResponsavelId: medicoId,
                    tipoAlerta: TipoAlerta.INDICACAOEXAMES, // Identifica o tipo correto para o BeforeInsert
                    prioridade: AlertaPrioridade.MEDIA,         // Score crítico exige prioridade ALTA
                    avaliacaoCaratId: String(avaliacaoSalva.id) // Vincula o alerta a esta avaliação específica
                });
                
                console.log(`[Gatilho Automático] Alerta INDICACAOEXAME criado para o utente ID: ${utenteId}`);
            } catch (erroAlerta) {
                // Bloco catch isolado para garantir que, se a criação automática do alerta falhar,
                // o utilizador não perde o registo do exame CARAT que acabou de fazer.
                console.error("Erro ao gerar o alerta automático de CARAT:", erroAlerta);
            }
        }
        return avaliacaoSalva;
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