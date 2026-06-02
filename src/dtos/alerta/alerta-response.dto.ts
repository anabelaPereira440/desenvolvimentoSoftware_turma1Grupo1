import { AlertaEstado } from '../../enums/AlertaEstado.enum';
import { AlertaPrioridade } from '../../enums/AlertaPrioridade.enum';
import { TipoAlerta } from '../../enums/TipoAlerta.enum';

export interface AlertaResponseDto {
    id: number;
    utenteId: number;
    medicoResponsavelId: number;
    motivo: string;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId: number | null;
    estado: AlertaEstado;
    prioridade: AlertaPrioridade;
    createdAt: Date;
    updatedAt: Date;
}
