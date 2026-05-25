import { TipoAlerta, AlertaPrioridade } from './alerta.entity'; 

export interface CreateAlertaDto {
    utenteId: number;
    medicoResponsavelId: string;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId?: string | null;
    prioridade?: AlertaPrioridade; 
    motivo?: string;              
}