import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { SexoBiologico } from '../enums/SexoBiologico.enum';
import { Medico } from './medico.entity';
import { Utilizador } from './utilizador.entity';

@Entity()
@Index(['medicoId'])
export class Utente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  numeroUtente!: number;

  @Column({ type: 'date' })
  dataNascimento!: Date;

  @Column({
    type: 'simple-enum',
    enum: SexoBiologico,
  })
  sexo!: SexoBiologico;

  @Column()
  contacto!: string;

  // Médico responsável pelo utente
  @Column()
  medicoId!: number;

  @ManyToOne(() => Medico, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'medicoId' })
  medico!: Medico;

  // Conta de acesso associada ao utente
  @Column()
  utilizadorId!: number;

  @ManyToOne(() => Utilizador, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utilizadorId' })
  utilizador!: Utilizador;

  @CreateDateColumn()
  dataCriacao!: Date;

  @UpdateDateColumn()
  dataAtualizacao!: Date;
}
