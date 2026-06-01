import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TipoRecomendacao } from '../enums/TipoRecomendacao.enum';
import { Utente } from './utente.entity';
import { AvaliacaoCarat } from './avaliacao-carat.entity';

@Entity()
export class Recomendacao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'simple-enum',
    enum: TipoRecomendacao,
  })
  tipo!: TipoRecomendacao;

  @Column({ type: 'text' })
  descricao!: string;

  // Indica se o utente já consultou esta recomendação no seu dashboard
  @Column({ default: false })
  foiLida!: boolean;

  // Utente destinatário da recomendação
  @Column()
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utenteId' })
  utente!: Utente;

  // Avaliação CARAT que gerou esta recomendação
  @Column()
  avaliacaoCaratId!: number;

  @ManyToOne(() => AvaliacaoCarat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avaliacaoCaratId' })
  avaliacaoCarat!: AvaliacaoCarat;

  @CreateDateColumn()
  dataCriacao!: Date;
}
