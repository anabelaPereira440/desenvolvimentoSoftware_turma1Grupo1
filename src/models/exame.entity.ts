import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TipoExame } from '../enums/TipoExame.enum';
import { Utente } from './utente.entity';

@Entity()
export class Exame {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({
    type: 'simple-enum',
    enum: TipoExame,
    default: TipoExame.OUTRO,
  })
  tipo!: TipoExame;

  @Column()
  codigo!: string;

  @Column()
  medico_nome!: string;

  // Utente ao qual o exame está associado
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
