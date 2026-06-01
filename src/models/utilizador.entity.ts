import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { TipoUtilizador } from '../enums/TipoUtilizador.enum';

@Entity()
export class Utilizador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'simple-enum',
    enum: TipoUtilizador,
  })
  role!: TipoUtilizador;

  @CreateDateColumn()
  dataCriacao!: Date;
}
