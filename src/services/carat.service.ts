import { AppDataSource } from '../database/database';
import { AvaliacaoCarat } from '../models/avaliacao-carat.entity';
import { Utente } from '../models/utente.entity';
import { Recomendacao } from '../models/recomendacao.entity';
import { NivelControlo } from '../enums/NivelControlo.enum';
import { TipoRecomendacao } from '../enums/TipoRecomendacao.enum';
import { CreateCaratDto } from '../dtos/carat/create-carat.dto';
import { ConfiguracaoService } from './configuracao.service';
import { AlertaService } from './alerta.service';
import { TipoAlerta } from '../enums/TipoAlerta.enum';
import { AlertaPrioridade } from '../enums/AlertaPrioridade.enum';

export class CaratService {
  private caratRepo = AppDataSource.getRepository(AvaliacaoCarat);
  private utenteRepo = AppDataSource.getRepository(Utente);
  private recomendacaoRepo = AppDataSource.getRepository(Recomendacao);
  private configuracaoService = new ConfiguracaoService();
  private alertaService = new AlertaService();

  async criarAvaliacao(utenteId: number, dados: CreateCaratDto): Promise<AvaliacaoCarat> {
    // ─── 1. Validação das respostas (inteiros de 0 a 3) ──────────────────────
    const respostas = [dados.p1, dados.p2, dados.p3, dados.p4, dados.p5, dados.p6, dados.p7, dados.p8, dados.p9, dados.p10];
    for (let i = 0; i < respostas.length; i++) {
      const v = respostas[i];
      if (v === undefined || v === null || !Number.isInteger(v) || v < 0 || v > 3) {
        throw new Error(`A pergunta ${i + 1} deve ser um inteiro entre 0 (pior controlo) e 3 (melhor controlo).`);
      }
    }

    // ─── 2. Verificar existência do utente ────────────────────────────────────
    const utente = await this.utenteRepo.findOneBy({ id: utenteId });
    if (!utente) throw new Error('Utente não encontrado no sistema.');

    // ─── 3. Obter configuração do sistema ─────────────────────────────────────
    const config = await this.configuracaoService.obterConfiguracao();

    // ─── 4. Calcular scores ───────────────────────────────────────────────────
    // Vias Superiores (rhinite): p1–p4   | range 0–12
    const subScoreViasSuperiores = dados.p1 + dados.p2 + dados.p3 + dados.p4;
    // Vias Inferiores (asma):    p5–p10  | range 0–18
    const subScoreViasInferiores = dados.p5 + dados.p6 + dados.p7 + dados.p8 + dados.p9 + dados.p10;
    // Total: range 0–30
    const scoreTotal = subScoreViasSuperiores + subScoreViasInferiores;

    // ─── 5. Determinar NivelControlo com base nos limiares da Configuracao ────
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

    // ─── 6. Calcular data da próxima avaliação recomendada ────────────────────
    const proximaAvaliacao = new Date();
    proximaAvaliacao.setDate(proximaAvaliacao.getDate() + config.proximaAvaliacaoSemanas * 7);

    // ─── 7. Guardar avaliação CARAT ───────────────────────────────────────────
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

    const avaliacaoSalva = await this.caratRepo.save(novaAvaliacao);

    // ─── 8. Gerar Recomendacoes ───────────────────────────────────────────────
    const medicoId = utente.medicoId;
    const recomendacoesParaCriar: Partial<Recomendacao>[] = [];

    // Recomendação de autocuidado — gerada sempre, com texto adaptado ao nível de controlo
    recomendacoesParaCriar.push({
      tipo: TipoRecomendacao.AUTOCUIDADO,
      descricao: this.getDescricaoAutocuidado(nivelControlo),
      foiLida: false,
      utenteId,
      avaliacaoCaratId: avaliacaoSalva.id,
    });

    // Recomendação de revisão terapêutica — score NAO_CONTROLADO
    if (nivelControlo === NivelControlo.NAO_CONTROLADO) {
      recomendacoesParaCriar.push({
        tipo: TipoRecomendacao.REVISAO_TERAPEUTICA,
        descricao: `Score CARAT de ${scoreTotal} (abaixo do limiar de ${config.limiarMinimoScore}). Revisão do plano terapêutico urgente.`,
        foiLida: false,
        utenteId,
        avaliacaoCaratId: avaliacaoSalva.id,
      });
    }

    // Recomendação de indicação de exame — score PARCIALMENTE_CONTROLADO
    if (nivelControlo === NivelControlo.PARCIALMENTE_CONTROLADO) {
      recomendacoesParaCriar.push({
        tipo: TipoRecomendacao.INDICACAO_EXAME,
        descricao: `Score CARAT de ${scoreTotal}. Indicação para realização de exames complementares de diagnóstico.`,
        foiLida: false,
        utenteId,
        avaliacaoCaratId: avaliacaoSalva.id,
      });
    }

    const recomendacoesSalvas = await this.recomendacaoRepo.save(recomendacoesParaCriar as Recomendacao[]);

    // ─── 9. Gerar Alertas automáticos a partir das Recomendacoes de risco ─────
    for (const rec of recomendacoesSalvas) {
      try {
        if (rec.tipo === TipoRecomendacao.REVISAO_TERAPEUTICA) {
          await this.alertaService.criarAlerta({
            utenteId,
            medicoResponsavelId: medicoId,
            tipoAlerta: TipoAlerta.REVISAOTERAPEUTICA,
            prioridade: AlertaPrioridade.ALTA,
            avaliacaoCaratId: String(avaliacaoSalva.id),
            recomendacaoId: rec.id,
          });
        } else if (rec.tipo === TipoRecomendacao.INDICACAO_EXAME) {
          await this.alertaService.criarAlerta({
            utenteId,
            medicoResponsavelId: medicoId,
            tipoAlerta: TipoAlerta.INDICACAOEXAMES,
            prioridade: AlertaPrioridade.MEDIA,
            avaliacaoCaratId: String(avaliacaoSalva.id),
            recomendacaoId: rec.id,
          });
        }
      } catch (erroAlerta) {
        // Erro no alerta não deve impedir o registo da avaliação CARAT
        console.error('[CaratService] Erro ao gerar alerta automático:', erroAlerta);
      }
    }

    // ─── 10. Verificar deterioração face à avaliação anterior ─────────────────
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
            avaliacaoCaratId: String(avaliacaoSalva.id),
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

  // ─── Helpers privados ─────────────────────────────────────────────────────

  private getDescricaoAutocuidado(nivel: NivelControlo): string {
    switch (nivel) {
      case NivelControlo.NAO_CONTROLADO:
        return 'A sua doença não está controlada. Siga rigorosamente o plano terapêutico, evite fatores desencadeantes (pó, pólenes, tabaco) e contacte o seu médico urgentemente.';
      case NivelControlo.PARCIALMENTE_CONTROLADO:
        return 'A sua doença está parcialmente controlada. Continue a tomar a medicação prescrita, identifique possíveis fatores que agravem os sintomas e agende uma consulta de revisão.';
      case NivelControlo.CONTROLADO:
        return 'Excelente! A sua doença está controlada. Continue com o plano prescrito, mantenha os hábitos saudáveis e realize a próxima avaliação CARAT na data sugerida.';
    }
  }
}
