import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Utente } from '../models/utente.entity';
import { NivelControlo } from '../enums/NivelControlo.enum';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { ConfiguracaoService } from './configuracao.service';
import { AlertaService } from './alerta.service';
import { TipoAlerta } from '../enums/TipoAlerta.enum';
import { AlertaPrioridade } from '../enums/AlertaPrioridade.enum';

export class CaratService {
  private caratRepo = AppDataSource.getRepository(AvaliacaoCarat);
  private utenteRepo = AppDataSource.getRepository(Utente);
  private configuracaoService = new ConfiguracaoService();
  private alertaService = new AlertaService();

  async criarAvaliacao(utenteId: number, dados: CreateCaratDto): Promise<AvaliacaoCarat> {
    // 1. Validação das respostas (inteiros de 0 a 3) 
    const respostas = [dados.p1, dados.p2, dados.p3, dados.p4, dados.p5, dados.p6, dados.p7, dados.p8, dados.p9, dados.p10];
    for (let i = 0; i < respostas.length; i++) {
      const v = respostas[i];
      if (v === undefined || v === null || !Number.isInteger(v) || v < 0 || v > 3) {
        throw new Error(`A pergunta ${i + 1} deve ser um inteiro entre 0 (pior controlo) e 3 (melhor controlo).`);
      }
    }

    // 2. Verificar existência do utente
    const utente = await this.utenteRepo.findOneBy({ id: utenteId });
    if (!utente) throw new Error('Utente não encontrado no sistema.');

    // 3. Obter configuração do sistema 
    const config = await this.configuracaoService.obterConfiguracao();

    // 4. Calcular scores 
    // Vias Superiores (rhinite): p1–p4   | range 0–12
    const subScoreViasSuperiores = dados.p1 + dados.p2 + dados.p3 + dados.p4;
    // Vias Inferiores (asma):    p5–p10  | range 0–18
    const subScoreViasInferiores = dados.p5 + dados.p6 + dados.p7 + dados.p8 + dados.p9 + dados.p10;
    // Total: range 0–30
    const scoreTotal = subScoreViasSuperiores + subScoreViasInferiores;

    //  5. Determinar NivelControlo com base nos limiares da Configuracao 
    //   score ≤ limiarMinimoScore              → NAO_CONTROLADO
    //   limiarMinimo < score ≤ limiarExame     → PARCIALMENTE_CONTROLADO
    //   score > limiarExame                    → CONTROLADO
    let nivelControlo: NivelControlo;
    let interpretacao: string;
    let resumoRecomendacoes: string;

    if (scoreTotal <= config.limiarMinimoScore) {
      nivelControlo = NivelControlo.NAO_CONTROLADO;
      interpretacao = 'Doença Respiratória Não Controlada (Controlo Insuficiente).';
      resumoRecomendacoes = 'Score CARAT abaixo do limiar mínimo. Revisão terapêutica urgente recomendada. Reforce medidas de autocuidado e monitorize os sintomas.';
    } else if (scoreTotal <= config.limiarScoreParaRecomendarExame) {
      nivelControlo = NivelControlo.PARCIALMENTE_CONTROLADO;
      interpretacao = 'Doença Respiratória Parcialmente Controlada.';
      resumoRecomendacoes = 'Indicação para a realização de exames complementares de diagnóstico. Manter o plano terapêutico habitual e agendar consulta de rotina.';
    } else {
      nivelControlo = NivelControlo.CONTROLADO;
      interpretacao = 'Doença Respiratória Controlada.';
      resumoRecomendacoes = `Excelente estado clínico! Continue com o plano prescrito. Próxima avaliação sugerida em ${config.proximaAvaliacaoSemanas} semanas.`;
    }

    // 6. Calcular data da próxima avaliação consoante nível de controlo 
    const semanasPorNivel: Record<NivelControlo, number> = {
      [NivelControlo.NAO_CONTROLADO]:         config.proximaAvaliacaoSemanasNaoControlado,
      [NivelControlo.PARCIALMENTE_CONTROLADO]: config.proximaAvaliacaoSemanasParcialmControlo,
      [NivelControlo.CONTROLADO]:              config.proximaAvaliacaoSemanas,
    };
    const semanasProxima = semanasPorNivel[nivelControlo];
    const proximaAvaliacao = new Date();
    proximaAvaliacao.setDate(proximaAvaliacao.getDate() + semanasProxima * 7);

    // 7. Guardar avaliação CARAT 
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
    novaAvaliacao.nivelControlo = nivelControlo;
    novaAvaliacao.interpretacao = interpretacao;
    novaAvaliacao.recomendacoes = resumoRecomendacoes;
    novaAvaliacao.proximaAvaliacao = proximaAvaliacao;
    novaAvaliacao.limiarMinimoScoreUsado = config.limiarMinimoScore;
    novaAvaliacao.limiarScoreParaRecomendarExameUsado = config.limiarScoreParaRecomendarExame;

    const avaliacaoSalva = await this.caratRepo.save(novaAvaliacao);

    // 8. Gerar Alerta se score NAO_CONTROLADO 
    const medicoId = utente.medicoId;
    if (nivelControlo === NivelControlo.NAO_CONTROLADO) {
      try {
        await this.alertaService.criarAlerta({
          utenteId,
          medicoResponsavelId: medicoId,
          tipoAlerta: TipoAlerta.REVISAOTERAPEUTICA,
          prioridade: AlertaPrioridade.ALTA,
          avaliacaoCaratId: avaliacaoSalva.id,
        });
      } catch (erroAlerta) {
        console.error('[CaratService] Erro ao gerar alerta de revisão terapêutica:', erroAlerta);
      }
    }

    // 9. Verificar deterioração face à avaliação anterior 
    try {
      const anteriores = await this.caratRepo.find({
        where: { utenteId },
        order: { data: 'DESC' },
        take: 2,
      });
      // anteriores[0] é a que acabou de ser guardada; anteriores[1] é a anterior
      const avaliacaoAnterior = anteriores.length >= 2 ? anteriores[1] : null;

      if (avaliacaoAnterior) {
        const queda = avaliacaoAnterior.scoreTotal - scoreTotal;
        if (queda >= config.deterioracaoScore) {
          await this.alertaService.criarAlerta({
            utenteId,
            medicoResponsavelId: medicoId,
            tipoAlerta: TipoAlerta.DETERIORACAOSCORE,
            prioridade: AlertaPrioridade.ALTA,
            avaliacaoCaratId: avaliacaoSalva.id,
            motivo: `Deterioração de ${queda} pontos no score CARAT (de ${avaliacaoAnterior.scoreTotal} para ${scoreTotal}).`,
          });
        }
      }
    } catch (erroDeteriacao) {
      console.error('[CaratService] Erro ao verificar deterioração:', erroDeteriacao);
    }

    return avaliacaoSalva;
  }

  async obterPorId(id: number): Promise<AvaliacaoCarat | null> {
    return this.caratRepo.findOne({
      where: { id },
      relations: ['utente'],
    });
  }

  async listarHistoricoPaciente(utenteId: number): Promise<AvaliacaoCarat[]> {
    const utente = await this.utenteRepo.findOneBy({ id: utenteId });
    if (!utente) throw new Error('Utente não encontrado.');

    return this.caratRepo.find({
      where: { utenteId },
      order: { data: 'DESC' },
    });
  }
}
