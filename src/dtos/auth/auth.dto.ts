export interface RegisterDTO {
  nome: string;
  username: string;
  password: string;
  role?: 'UTENTE' | 'MEDICO' | 'ADMIN';
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: number;
    nome: string;
    username: string;
    role: string;
  };
}