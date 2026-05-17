import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Utente {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;
    
    @Column({
        unique: true
    })
    numeroUtente!: number;

    @Column()
    dataNascimento!: Date;

    @Column()
    sexo!: string;

    @Column()
    contacto!: string;

    @Column()
    medicoId!: number;
}