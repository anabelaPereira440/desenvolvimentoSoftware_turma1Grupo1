import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SexoBiologico } from '../enums/SexoBiologico.enum';
import { EspecialidadeMedica } from '../enums/EspecialidadeMedica.enum';
import { Utilizador } from './utilizador.entity';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({
    type: 'simple-enum',
    enum: EspecialidadeMedica,
  })
  especialidade!: EspecialidadeMedica;

  @Column({ unique: true })
  cedulaProfissional!: number;

  @Column({ type: 'date' })
  dataNascimento!: Date;

  @Column({
    type: 'simple-enum',
    enum: SexoBiologico,
  })
  sexo!: SexoBiologico;

  @Column()
  contacto!: string;

  // Conta de acesso associada ao médico
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
