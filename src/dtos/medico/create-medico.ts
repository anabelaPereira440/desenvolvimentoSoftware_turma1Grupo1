// Define os dados de entrada para criar um médico.
export interface CreateMedicoDTO {
    nome: string;
    especialidade: string;
    cedulaProfissional: number;
    dataNascimento: string;
    sexo: string;
    contacto: string;
}