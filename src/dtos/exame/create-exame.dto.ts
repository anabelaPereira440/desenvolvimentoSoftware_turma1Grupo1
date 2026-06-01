import { TipoExame } from '../../enums/TipoExame.enum';

export interface CreateExameDto {
  nome: string;
  tipo: TipoExame;
  codigo: string;
  medico_nome: string;
  utenteId: number;
  dataValidade?: string;
}
