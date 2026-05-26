import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column()
  role!: string; // 'UTENTE' | 'MEDICO' | 'ADMIN'

  @CreateDateColumn()
  dataCriacao!: Date;
}