import { TipoAlerta } from '../../enums/TipoAlerta.enum';
import { AlertaPrioridade } from '../../enums/AlertaPrioridade.enum';
import { AlertaEstado } from '../../enums/AlertaEstado.enum';

export interface CreateAlertaDto {
    utenteId: number;
    medicoResponsavelId: number;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId?: number | null;
    prioridade?: AlertaPrioridade;
    motivo?: string;
}

export interface UpdateAlertaDto {
    estado?: AlertaEstado;
    prioridade?: AlertaPrioridade;
}