import { TipoAlerta } from '../../enums/TipoAlerta.enum';
import { AlertaPrioridade } from '../../enums/AlertaPrioridade.enum';

export interface CreateAlertaDto {
    utenteId: number;
    medicoResponsavelId: number;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId?: string | null;
    prioridade?: AlertaPrioridade; 
    motivo?: string;              
}