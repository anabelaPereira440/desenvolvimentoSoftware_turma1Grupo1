import { SexoBiologico } from '../../enums/SexoBiologico.enum';

export interface CreateUtenteDTO {
  nome: string;
  numeroUtente: number;
  dataNascimento: string;
  sexo: SexoBiologico;
  contacto: string;
  medicoId: number;
  utilizadorId: number;
}

export interface UpdateUtenteDTO {
  nome?: string;
  contacto?: string;
  medicoId?: number;
}
