import { SexoBiologico } from '../../enums/SexoBiologico.enum';
import { EspecialidadeMedica } from '../../enums/EspecialidadeMedica.enum';

export interface CreateMedicoDTO {
  nome: string;
  especialidade: EspecialidadeMedica;
  cedulaProfissional: number;
  dataNascimento: string;
  sexo: SexoBiologico;
  contacto: string;
  utilizadorId: number;
}

export interface UpdateMedicoDTO {
  nome?: string;
  especialidade?: EspecialidadeMedica;
  cedulaProfissional?: number;
  contacto?: string;
}
