import { ViaAdministracao } from '../../enums/ViaAdministracao.enum';

export interface CreatePrescricaoDto {
  medicamento: string;
  dose: string;
  viaAdministracao: ViaAdministracao;
  medico_nome: string;
  utenteId: number;
  dataValidade?: string;
}
