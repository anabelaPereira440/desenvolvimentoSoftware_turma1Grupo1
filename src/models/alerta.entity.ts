import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

// IMPORTA as tuas entidades reais
import { Utente } from './utente.entity';
import { Medico } from './medico.entity';
import { AvaliacaoCarat } from './avaliacao-carat.entity';

// Enums
export enum AlertaEstado {
  NOVO = 'NOVO',
  VISTO = 'VISTO',
  EMSEGUIMENTO = 'EM_SEGUIMENTO',
  FECHADO = 'FECHADO',
}

export enum AlertaPrioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

export enum TipoAlerta {
  SCOREABAIXOLIMIAR = 'SCORE_ABAIXO_LIMIAR',
  DETERIORACAOSCORE = 'DETERIORACAO_SCORE',
  SINTOMAPERSISTENTE = 'SINTOMA_PERSISTENTE',
  INDICACAOEXAMES = 'INDICACAO_EXAMES',
  REVISAOTERAPEUTICA = 'REVISAO_TERAPEUTICA',
}

@Entity()
//Índice composto baseado em 3 colunas
@Index(['medicoResponsavelId', 'estado', 'prioridade'])
@Index(['utenteId', 'createdAt'])
export class Alerta {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relações principais
  @Column()
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'utente_id' })
  utente!: Utente;

  @Column()
  medicoResponsavelId!: string;

  @ManyToOne(() => Medico, { onDelete: 'RESTRICT'})
  @JoinColumn({ name: 'medico_responsavel_id' })
  medicoResponsavel!: Medico;

  @Column({ type: 'text' })
  motivo!: string;

  // Contexto/justificação do alerta (gatilhos possíveis)
  @Column({
    name: 'tipo_gatilho',
    type: 'enum',
    enum: TipoAlerta,
  })
  tipoGatilho!: TipoAlerta;

  @Column({ name: 'avaliacao_carat_id', type: 'uuid', nullable: true })
  avaliacaoCaratId?: string | null;

  @ManyToOne(() => AvaliacaoCarat, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'avaliacao_carat_id' })
  avaliacaoCarat?: AvaliacaoCarat | null;

  // Estado e prioridade (médico pode alterar)
  @Column({
    type: 'enum',
    enum: AlertaEstado,
    default: AlertaEstado.NOVO,
  })
  estado!: AlertaEstado;

  @Column({
    type: 'enum',
    enum: AlertaPrioridade,
    default: AlertaPrioridade.MEDIA,
  })
  prioridade!: AlertaPrioridade;

  // Timestamps
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

// Conveniências de negócio
setPrioridade(p: AlertaPrioridade) {
    if (!Object.values(AlertaPrioridade).includes(p)) {
      throw new Error('Prioridade inválida');
    }
    this.prioridade = p;
  }

  // Executa automaticamente antes de inserir na Base de Dados
  @BeforeInsert()
  setMotivoPorTipoAlerta() {
    if (this.motivo && this.motivo.trim().length > 0) return;
  // Define texto padrão do motivo consoante o tipo de alerta
    switch (this.tipoGatilho) {
      case TipoAlerta.SCOREABAIXOLIMIAR:
        this.motivo = 'Score CARAT abaixo do limiar de controlo.';
        break;
      case TipoAlerta.DETERIORACAOSCORE:
        this.motivo = 'Deterioração significativa do score CARAT.';
        break;
      case TipoAlerta.SINTOMAPERSISTENTE:
        this.motivo = 'Sintomas persistentes/severos registados.';
        break;
      case TipoAlerta.INDICACAOEXAMES:
        this.motivo = 'Indicação de exames complementares.';
        break;
      case TipoAlerta.REVISAOTERAPEUTICA:
        this.motivo = 'Indicação de revisão terapêutica.';
        break;
      default:
        this.motivo = 'Alerta clínico.';
    }
  }

  // Executa automaticamente antes de Inserir e Atualizar
  @BeforeInsert()
  @BeforeUpdate()
// Valida integridade mínima antes de persistir (pode ser chamado no serviço)
  validateIntegrity() {
    if (!this.utenteId) throw new Error('Alerta sem utente associado.');
    if (!this.medicoResponsavelId) throw new Error('Alerta sem médico responsável.');
    if (!this.tipoGatilho) throw new Error('Tipo de alerta é obrigatório.');
    if (!this.motivo || !this.motivo.trim()) {
      throw new Error('Motivo é obrigatório.');
    }
  }
}
