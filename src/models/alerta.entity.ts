import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { AlertaEstado } from '../enums/AlertaEstado.enum';
import { AlertaPrioridade } from '../enums/AlertaPrioridade.enum';
import { TipoAlerta } from '../enums/TipoAlerta.enum';
import { Utente } from './utente.entity';
import { Medico } from './medico.entity';
import { AvaliacaoCarat } from './avaliacao-carat.entity';

@Entity()
@Index(['medicoResponsavelId', 'estado', 'prioridade'])
@Index(['utenteId', 'createdAt'])
export class Alerta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utenteId' })
  utente!: Utente;

  @Column({ type: 'integer' })
  medicoResponsavelId!: number;

  @ManyToOne(() => Medico, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'medicoResponsavelId' })
  medicoResponsavel!: Medico;

  @Column({ type: 'text' })
  motivo!: string;

  @Column({
    name: 'tipo_alerta',
    type: 'simple-enum',
    enum: TipoAlerta,
  })
  tipoAlerta!: TipoAlerta;

  // Avaliação CARAT que originou este alerta
  @Column({ type: 'integer', nullable: true })
  avaliacaoCaratId?: number | null;

  @ManyToOne(() => AvaliacaoCarat, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'avaliacaoCaratId' })
  avaliacaoCarat?: AvaliacaoCarat;

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
}
