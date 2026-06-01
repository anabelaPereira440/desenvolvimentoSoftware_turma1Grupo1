import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ViaAdministracao } from '../enums/ViaAdministracao.enum';
import { Utente } from './utente.entity';

@Entity()
export class Prescricao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  medicamento!: string;

  @Column()
  dose!: string;

  @Column({
    type: 'simple-enum',
    enum: ViaAdministracao,
    default: ViaAdministracao.ORAL,
  })
  viaAdministracao!: ViaAdministracao;

  @Column()
  medico_nome!: string;

  // Utente ao qual a prescrição está associada
  @Column()
  utenteId!: number;

  @ManyToOne(() => Utente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utenteId' })
  utente!: Utente;

  @CreateDateColumn()
  dataCriacao!: Date;

  @Column({ type: 'date' })
  dataValidade!: Date;
}
