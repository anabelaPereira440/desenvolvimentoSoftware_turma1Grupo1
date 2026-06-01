import { AlertaEstado } from '../../enums/AlertaEstado.enum';
import { AlertaPrioridade } from '../../enums/AlertaPrioridade.enum';
import { TipoAlerta } from '../../enums/TipoAlerta.enum';

interface UtenteResumoDto {
    id: number;
    nome: string;
}

interface AvaliacaoCaratResumoDto {
    id: string;
    scoreTotal: number;
    dataSubmissao: Date;
}

export interface AlertaResponseDto {
    id: number;
    utenteId: number;
    utente?: UtenteResumoDto | undefined; 
    medicoResponsavelId: number;
    motivo: string;
    tipoAlerta: TipoAlerta;
    avaliacaoCaratId: string | null;
    avaliacaoCarat?: AvaliacaoCaratResumoDto | undefined; 
    estado: AlertaEstado;
    prioridade: AlertaPrioridade;
    createdAt: Date;
    updatedAt: Date;
}

export function mapearParaAlertaResponse(alerta: any): AlertaResponseDto {
    return {
        id: alerta.id,
        utenteId: alerta.utenteId,
        medicoResponsavelId: alerta.medicoResponsavelId,
        motivo: alerta.motivo,
        tipoAlerta: alerta.tipoAlerta,
        avaliacaoCaratId: alerta.avaliacaoCaratId || null,
        estado: alerta.estado,
        prioridade: alerta.prioridade,
        createdAt: alerta.createdAt,
        updatedAt: alerta.updatedAt,
        
        utente: alerta.utente ? {
            id: alerta.utente.id,
            nome: alerta.utente.nome,
        } : undefined, 
        
        avaliacaoCarat: alerta.avaliacaoCarat ? {
            id: alerta.avaliacaoCarat.id,
            scoreTotal: alerta.avaliacaoCarat.scoreTotal,
            dataSubmissao: alerta.avaliacaoCarat.createdAt || alerta.avaliacaoCarat.dataSubmissao
        } : undefined
    };
}