import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Utente } from './utente.entity';

@Entity()
export class AvaliacaoCarat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    data!: Date;

    @Column() 
    p1!: number;

    @Column() 
    p2!: number;
    
    @Column() 
    p3!: number;
    
    @Column() 
    p4!: number;
    
    @Column() 
    p5!: number;
    
    @Column() 
    p6!: number;
    
    @Column() 
    p7!: number;
    
    @Column() 
    p8!: number;
    
    @Column() 
    p9!: number;
    
    @Column() 
    p10!: number;

    @Column() 
    scoreTotal!: number;
    
    @Column() 
    subScoreViasSuperiores!: number;
    
    @Column() 
    subScoreViasInferiores!: number;
    
    @Column() 
    interpretacao!: string;
    
    @Column() 
    recomendacoes!: string;

    @Column() 
    utenteId!: number;

    @ManyToOne(() => Utente, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'utenteId' })
    utente!: Utente;
}