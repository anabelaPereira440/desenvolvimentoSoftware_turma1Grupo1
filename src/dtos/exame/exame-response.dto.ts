import { TipoExame } from '../../enums/TipoExame.enum';

export interface ExameResponseDto {
  id: number;
  nome: string;
  tipo: TipoExame;
  codigo: string;
  medico_nome: string;
  utenteId: number;
  dataCriacao: Date;
  dataValidade: Date;
}
