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
  @Column({ type: 'integer' })
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'utente_id' })
  utente!: Utente;

  @Column({type: 'varchar' })
  medicoResponsavelId!: string;

  @ManyToOne(() => Medico, { onDelete: 'RESTRICT'})
  @JoinColumn({ name: 'medico_responsavel_id' })
  medicoResponsavel!: Medico;

  @Column({ type: 'text' })
  motivo!: string;

  // Contexto/justificação do alerta
  @Column({
    name: 'tipo_alerta',
    type: 'simple-enum',
    enum: TipoAlerta,
  })
  tipoAlerta!: TipoAlerta;

  @Column({ type: 'varchar', nullable: true })
  avaliacaoCaratId?: string | null;

  @ManyToOne(() => AvaliacaoCarat, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'avaliacaoCaratId' })
  avaliacaoCarat?: AvaliacaoCarat;
  

  // Estado e prioridade (médico pode alterar)
  @Column({
    type: 'simple-enum',
    enum: AlertaEstado,
    default: AlertaEstado.NOVO,
  })
  estado!: AlertaEstado;

  @Column({
    type: 'simple-enum',
    enum: AlertaPrioridade,
    default: AlertaPrioridade.MEDIA,
  })
  prioridade!: AlertaPrioridade;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
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
    switch (this.tipoAlerta) {
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
    if (!this.tipoAlerta) throw new Error('Tipo de alerta é obrigatório.');
    if (!this.motivo || !this.motivo.trim()) {
      throw new Error('Motivo é obrigatório.');
    }
  }
}
