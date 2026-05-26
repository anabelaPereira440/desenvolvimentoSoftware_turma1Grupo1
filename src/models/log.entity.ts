//Auditoria Mínima
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Log {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  utilizadorId?: number;

  @Column({ nullable: true })
  username?: string;

  @Column()
  acao!: string; // 'REGISTO' | 'LOGIN' | 'LOGIN_FALHADO' | 'LOGOUT' ...

  @Column({ nullable: true })
  detalhe?: string;

  @CreateDateColumn()
  dataHora!: Date;
}