import { TipoAlerta, AlertaPrioridade } from '../../models/alerta.entity'; 

export interface CreateAlertaDto {
    utenteId: number;
    medicoResponsavelId: string;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId?: string | null;
    prioridade?: AlertaPrioridade; 
    motivo?: string;              
}