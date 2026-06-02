import { AppDataSource } from '../database/database';
import { Configuracao } from '../models/configuracao.entity';
import { UpdateConfiguracaoDto } from '../dtos/configuracao/update-configuracao.dto';

export class ConfiguracaoService {
  private repo = AppDataSource.getRepository(Configuracao);

  // Devolve a configuração do sistema (cria com defaults se não existir)
  async obterConfiguracao(): Promise<Configuracao> {
    const config = await this.repo.findOne({ where: {} });
    if (!config) {
      const defaultConfig = new Configuracao();
      return this.repo.save(defaultConfig);
    }
    return config;
  }

  // Atualiza os parâmetros do sistema (apenas administrador)
  async atualizarConfiguracao(dados: UpdateConfiguracaoDto): Promise<Configuracao> {
    const config = await this.obterConfiguracao();

    if (dados.limiarMinimoScore !== undefined) {
      if (typeof dados.limiarMinimoScore !== 'number' || dados.limiarMinimoScore < 0 || dados.limiarMinimoScore > 30) {
        throw new Error('limiarMinimoScore deve ser um número entre 0 e 30.');
      }
      config.limiarMinimoScore = dados.limiarMinimoScore;
    }

    if (dados.limiarScoreParaRecomendarExame !== undefined) {
      if (typeof dados.limiarScoreParaRecomendarExame !== 'number' || dados.limiarScoreParaRecomendarExame < 0 || dados.limiarScoreParaRecomendarExame > 30) {
        throw new Error('limiarScoreParaRecomendarExame deve ser um número entre 0 e 30.');
      }
      if (dados.limiarScoreParaRecomendarExame < config.limiarMinimoScore) {
        throw new Error('limiarScoreParaRecomendarExame não pode ser inferior a limiarMinimoScore.');
      }
      config.limiarScoreParaRecomendarExame = dados.limiarScoreParaRecomendarExame;
    }

    if (dados.deterioracaoScore !== undefined) {
      if (typeof dados.deterioracaoScore !== 'number' || dados.deterioracaoScore <= 0 || dados.deterioracaoScore > 30) {
        throw new Error('deterioracaoScore deve ser um número positivo até 30.');
      }
      config.deterioracaoScore = dados.deterioracaoScore;
    }

    if (dados.proximaAvaliacaoSemanas !== undefined) {
      if (!Number.isInteger(dados.proximaAvaliacaoSemanas) || dados.proximaAvaliacaoSemanas < 1 || dados.proximaAvaliacaoSemanas > 52) {
        throw new Error('proximaAvaliacaoSemanas deve ser um inteiro entre 1 e 52.');
      }
      config.proximaAvaliacaoSemanas = dados.proximaAvaliacaoSemanas;
    }

    if (dados.proximaAvaliacaoSemanasParcialmControlo !== undefined) {
      if (!Number.isInteger(dados.proximaAvaliacaoSemanasParcialmControlo) || dados.proximaAvaliacaoSemanasParcialmControlo < 1 || dados.proximaAvaliacaoSemanasParcialmControlo > 52) {
        throw new Error('proximaAvaliacaoSemanasParcialmControlo deve ser um inteiro entre 1 e 52.');
      }
      config.proximaAvaliacaoSemanasParcialmControlo = dados.proximaAvaliacaoSemanasParcialmControlo;
    }

    if (dados.proximaAvaliacaoSemanasNaoControlado !== undefined) {
      if (!Number.isInteger(dados.proximaAvaliacaoSemanasNaoControlado) || dados.proximaAvaliacaoSemanasNaoControlado < 1 || dados.proximaAvaliacaoSemanasNaoControlado > 52) {
        throw new Error('proximaAvaliacaoSemanasNaoControlado deve ser um inteiro entre 1 e 52.');
      }
      config.proximaAvaliacaoSemanasNaoControlado = dados.proximaAvaliacaoSemanasNaoControlado;
    }

    return this.repo.save(config);
  }
}
