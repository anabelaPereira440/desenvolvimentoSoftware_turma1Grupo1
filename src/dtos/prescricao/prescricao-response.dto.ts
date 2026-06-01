import { ViaAdministracao } from '../../enums/ViaAdministracao.enum';

export interface PrescricaoResponseDto {
  id: number;
  medicamento: string;
  dose: string;
  viaAdministracao: ViaAdministracao;
  medico_nome: string;
  utenteId: number;
  dataCriacao: Date;
  dataValidade: Date;
}
