// Define os dados de entrada para criar um utente.
export interface CreateUtenteDTO {
    nome: string;
    numeroUtente: number;
    dataNascimento: string;
    sexo: string;
    contacto: string;
    medicoId: number;
}

export interface UpdateUtenteDTO {
    nome?: string;
    contacto?: string;
    medicoId?: number;
}