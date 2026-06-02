export interface UpdateConfiguracaoDto {
  limiarMinimoScore?: number;
  deterioracaoScore?: number;
  limiarScoreParaRecomendarExame?: number;
  proximaAvaliacaoSemanas?: number;
  proximaAvaliacaoSemanasParcialmControlo?: number;
  proximaAvaliacaoSemanasNaoControlado?: number;
}
