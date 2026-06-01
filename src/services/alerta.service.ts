import { AppDataSource } from '../database/database';
import { FindOptionsWhere } from 'typeorm';
import { Alerta } from '../models/alerta.entity';
import { AlertaEstado } from '../enums/AlertaEstado.enum';
import { AlertaPrioridade } from '../enums/AlertaPrioridade.enum';
import { TipoAlerta } from '../enums/TipoAlerta.enum';

export class AlertaService {
    private repo = AppDataSource.getRepository(Alerta);

    async criarAlerta(dados: {
        utenteId: number;
        medicoResponsavelId: number;
        tipoAlerta: TipoAlerta;
        avaliacaoCaratId?: string | null;
        recomendacaoId?: number | null;
        prioridade?: AlertaPrioridade;
        motivo?: string;
    }): Promise<Alerta> {
        if (!dados.utenteId) throw new Error('Alerta sem utente associado.');
        if (!dados.medicoResponsavelId) throw new Error('Alerta sem médico responsável.');
        if (!dados.tipoAlerta) throw new Error('Tipo de alerta é obrigatório.');

        // Gera o motivo padrão se não for fornecido
        const motivo = dados.motivo?.trim() || this.motivoPadrao(dados.tipoAlerta);

        const novoAlerta = this.repo.create({
            utenteId: dados.utenteId,
            medicoResponsavelId: dados.medicoResponsavelId,
            tipoAlerta: dados.tipoAlerta,
            avaliacaoCaratId: dados.avaliacaoCaratId ?? null,
            recomendacaoId: dados.recomendacaoId ?? null,
            prioridade: dados.prioridade ?? AlertaPrioridade.MEDIA,
            estado: AlertaEstado.NOVO,
            motivo,
        });

        return this.repo.save(novoAlerta);
    }

    async listarAlertas(filtros: {
        medicoResponsavelId?: number;
        estado?: AlertaEstado;
        prioridade?: AlertaPrioridade;
    }): Promise<Alerta[]> {
        const where: FindOptionsWhere<Alerta> = {};

        if (filtros.medicoResponsavelId) where.medicoResponsavelId = filtros.medicoResponsavelId;
        if (filtros.estado) where.estado = filtros.estado;
        if (filtros.prioridade) where.prioridade = filtros.prioridade;

        return this.repo.find({
            where,
            relations: ['utente', 'avaliacaoCarat'],
            order: { createdAt: 'DESC' },
        });
    }

    async buscarPorId(id: number): Promise<Alerta | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['utente', 'avaliacaoCarat'],
        });
    }

    async buscarPorUtente(utenteId: number): Promise<Alerta[]> {
        return this.repo.find({
            where: { utenteId },
            relations: ['avaliacaoCarat'],
            order: { createdAt: 'DESC' },
        });
    }

    async atualizarAlerta(
        id: number,
        dados: { estado?: AlertaEstado; prioridade?: AlertaPrioridade }
    ): Promise<Alerta> {
        const alerta = await this.repo.findOne({ where: { id } });
        if (!alerta) throw new Error('Alerta clínico não encontrado.');

        if (dados.estado !== undefined) {
            if (!Object.values(AlertaEstado).includes(dados.estado)) {
                throw new Error(`Estado inválido. Valores aceites: ${Object.values(AlertaEstado).join(', ')}.`);
            }
            alerta.estado = dados.estado;
        }

        if (dados.prioridade !== undefined) {
            if (!Object.values(AlertaPrioridade).includes(dados.prioridade)) {
                throw new Error(`Prioridade inválida. Valores aceites: ${Object.values(AlertaPrioridade).join(', ')}.`);
            }
            alerta.prioridade = dados.prioridade;
        }

        return this.repo.save(alerta);
    }

    private motivoPadrao(tipo: TipoAlerta): string {
        switch (tipo) {
            case TipoAlerta.DETERIORACAOSCORE:
                return 'Deterioração significativa do score CARAT.';
            case TipoAlerta.INDICACAOEXAMES:
                return 'Score CARAT indica necessidade de exames complementares.';
            case TipoAlerta.REVISAOTERAPEUTICA:
                return 'Score CARAT abaixo do limiar mínimo. Revisão terapêutica urgente.';
            default:
                return 'Alerta clínico.';
        }
    }
}
