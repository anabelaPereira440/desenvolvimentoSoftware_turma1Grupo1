import { Repository } from 'typeorm';
import { AppDataSource } from ./database/database';
import { AlertaClinico, AlertaEstado, AlertaPrioridade } from './alerta.entity';

export class AlertaService {
    private repository: Repository<AlertaClinico>;

    constructor() {
        // Inicializa o repositório a partir do DataSource global da aplicação
        this.repository = AppDataSource.getRepository(AlertaClinico);
    }

    //Criação de Alerta Clínico (Gatilho automático do BreathCare)

    async criarAlerta(dados: {
        utenteId: number;
        medicoResponsavelId: string;
        tipoGatilho: TipoAlerta;
        avaliacaoCaratId?: string | null;
        prioridade?: AlertaPrioridade;
        motivo?: string; 
    }): Promise<AlertaClinico> {
        // O repository.create() instancia a classe da entidade permitindo que os ganchos @BeforeInsert funcionem
        const novoAlerta = this.repository.create({
            utenteId: dados.utenteId,
            medicoResponsavelId: dados.medicoResponsavelId,
            tipoGatilho: dados.tipoGatilho,
            avaliacaoCaratId: dados.avaliacaoCaratId,
            prioridade: dados.prioridade || AlertaPrioridade.MEDIA,
            estado: AlertaEstado.NOVO,
            motivo: dados.motivo
        });

        // O save vai disparar o setMotivoPorTipoAlerta e o validateIntegrity automaticamente
        return await this.repository.save(novoAlerta);
    }

    /**
     * REQUISITO: Listar os alertas com base em filtros opcionais (médico responsável, estado e prioridade).
     * O médico deve auditar e listar os alertas sob a sua alçada.
     */
    async listarAlertas(filtros: { 
        medicoResponsavelId?: string; 
        estado?: AlertaEstado; 
        prioridade?: AlertaPrioridade; 
    }): Promise<AlertaClinico[]> {
        const { medicoResponsavelId, estado, prioridade } = filtros;

        // Construção dinâmica da cláusula WHERE com base nos parâmetros preenchidos
        const where: any = {};

        if (medicoResponsavelId) {
            where.medicoResponsavelId = medicoResponsavelId;
        }
        if (estado) {
            where.estado = estado;
        }
        if (prioridade) {
            where.prioridade = prioridade;
        }

        // Retorna a lista trazendo também as relações para o médico ver os dados nos dashboards
        return await this.repository.find({
            where,
            relations: ['utente', 'avaliacaoCarat'], // Carrega os dados adjacentes do Utente e da Avaliação CARAT
            order: {
                createdAt: 'DESC' // Alertas mais recentes aparecem primeiro para rápida intervenção proativa
            }
        });
    }

    /**
     * REQUISITO: Permitir ao médico consultar os detalhes de um alerta clínico específico.
     */
    async buscarPorId(id: number): Promise<AlertaClinico | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['utente', 'avaliacaoCarat']
        });
    }

    /**
     * REQUISITO: Permitir consultar os alertas gerados especificamente para um utente.
     * Útil quando o médico abre o perfil clínico e histórico completo do utente.
     */
    async buscarPorUtente(utenteId: number): Promise<AlertaClinico[]> {
        return await this.repository.find({
            where: { utenteId },
            relations: ['avaliacaoCarat'],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    /**
     * REQUISITO: Permitir que o médico altere o estado (Novo, Visto, Em Seguimento, Fechado)
     * ou atualize a prioridade de um alerta clínico após a sua análise.
     */
    async atualizarAlerta(
        id: number, 
        dadosAtualizacao: { estado?: AlertaEstado; prioridade?: AlertaPrioridade }
    ): Promise<AlertaClinico> {
        // 1. Verifica se o alerta de facto existe no sistema
        const alerta = await this.repository.findOne({ where: { id } });
        if (!alerta) {
            throw new Error("Alerta clínico não encontrado na base de dados.");
        }

        // 2. Aplica apenas as propriedades que foram enviadas no corpo do pedido
        if (dadosAtualizacao.estado !== undefined) {
            alerta.estado = dadosAtualizacao.estado;
        }
        if (dadosAtualizacao.prioridade !== undefined) {
            alerta.prioridade = dadosAtualizacao.prioridade;
        }

        // 3. Persiste a alteração na base de dados (o TypeORM atualiza automaticamente a coluna updatedAt)
        return await this.repository.save(alerta);
    }
}
