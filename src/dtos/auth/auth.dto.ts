export interface RegisterDTO {
  nome: string;
  email: string;
  password: string;
  role?: 'UTENTE' | 'MEDICO' | 'ADMIN';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    role: string;
  };
}