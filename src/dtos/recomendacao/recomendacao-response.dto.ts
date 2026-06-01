import { TipoRecomendacao } from '../../enums/TipoRecomendacao.enum';

export interface RecomendacaoResponseDto {
  id: number;
  tipo: TipoRecomendacao;
  descricao: string;
  foiLida: boolean;
  utenteId: number;
  avaliacaoCaratId: number;
  dataCriacao: Date;
}
