import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Medico {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column()
    especialidade!: string;
    
    @Column({unique: true})
    cedulaProfissional!: number;

    @Column()
    dataNascimento!: Date;

    @Column()
    sexo!: string;

    @Column()
    contacto!: string;

    @Column()
    utilizadorId!: number;
}