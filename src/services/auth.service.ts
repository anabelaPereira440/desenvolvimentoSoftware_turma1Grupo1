/*Esta classe AuthService é responsável por autenticar um utilizador.

Ou seja, recebe:
    •   username
    •   password

e verifica se:
    1.  o utilizador existe
    2.  a password está correta

Se tudo correr bem, gera um token JWT que poderá depois ser usado nas rotas protegidas.*/

import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../database/database';
import { Utilizador } from '../models/utilizador.entity';
import { Log } from '../models/log.entity';
import { appConfig } from '../config/app.config';

export class AuthService {

  private get userRepo() {
    return AppDataSource.getRepository(Utilizador);
  }

  private get logRepo() {
    return AppDataSource.getRepository(Log);
  }

  // Regista um novo utilizador
  async registar(
    nome: string,
    username: string,
    password: string,
    role: string
  ): Promise<{ token: string; user: any }> {

    // Validações de input (Lógica Condicional Obrigatória)
    if (!nome || nome.trim().length < 2) {
      throw new Error('O nome deve ter pelo menos 2 caracteres.');
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome.trim())) {
      throw new Error('O nome só pode conter letras e espaços.');
    }
    if (!username || username.trim().length < 3) {
      throw new Error('O username deve ter pelo menos 3 caracteres.');
    }
    if (!password || password.length < 6) {
      throw new Error('A password deve ter pelo menos 6 caracteres.');
    }

    const roleFinal = (role || 'UTENTE').toUpperCase();
    if (!['UTENTE', 'MEDICO', 'ADMIN'].includes(roleFinal)) {
      throw new Error('Perfil inválido. Use UTENTE, MEDICO ou ADMIN.');
    }

    // Verificar se já existe
    const existente = await this.userRepo.findOneBy({ username: username.trim() });
    if (existente) {
      throw new Error('Já existe um utilizador com esse username.');
    }

    // Hash da password para armazenamento seguro
    const passwordHash = await bcrypt.hash(password, 10);

    // Instanciação formal da entidade para evitar erros de tipagem no save
    const utilizadorInstancia = this.userRepo.create({
      nome: nome.trim(),
      username: username.trim(),
      password: passwordHash,
      role: roleFinal
    });

    // Guardar na Base de Dados (SQLite via TypeORM)
    const novoUser = await this.userRepo.save(utilizadorInstancia);

    // Registar log de auditoria obrigatório
    await this.registarLog(novoUser.id, novoUser.username, 'REGISTO',
      `Novo utilizador criado com perfil ${roleFinal}`);

    // Gerar token de autenticação
    const token = this.gerarToken(novoUser.id, novoUser.username, novoUser.role);

    return {
      token,
      user: {
        id: novoUser.id,
        nome: novoUser.nome,
        username: novoUser.username,
        role: novoUser.role
      }
    };
  }

  // Autentica um utilizador existente
  async login(username: string, password: string): Promise<{ token: string; user: any }> {

    if (!username || !password) {
      throw new Error('Username e password são obrigatórios.');
    }

    const user = await this.userRepo.findOneBy({ username: username.trim() });

    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    // Comparação segura do hash da password
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      await this.registarLog(user.id, user.username, 'LOGIN_FALHADO',
        'Password incorreta');
      throw new Error('Credenciais inválidas.');
    }

    // Registar log de login bem-sucedido
    await this.registarLog(user.id, user.username, 'LOGIN',
      'Login efetuado com sucesso');

    const token = this.gerarToken(user.id, user.username, user.role);

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        role: user.role
      }
    };
  }

  // Lista todos os logs (Uso exclusivo do perfil ADMIN)
  async listarLogs(): Promise<Log[]> {
    return this.logRepo.find({
      order: { dataHora: 'DESC' },
      take: 100
    });
  }

  // Gera o JSON Web Token (JWT)
  private gerarToken(id: number, username: string, role: string): string {
    // Solução: Tipificar o options como any remove a rigidez da biblioteca jwt
    const options: any = {
      expiresIn: appConfig.auth.jwtExpiresIn
    };

    return jwt.sign(
      { id, username, role },
      appConfig.auth.jwtSecret,
      options
    );
  }

  // Regista uma ação na tabela de logs (Logs Mínimos do Sistema)
async registarLog(
    utilizadorId: number | null,
    username: string,
    acao: string,
    detalhe: string
  ): Promise<void> {
    try {
      // Solução: Fazemos o cast para any para o TypeScript aceitar o null/undefined 
      // independentemente de como desenhaste a entidade Log
      const novoLog = this.logRepo.create({
        utilizadorId: (utilizadorId === null ? undefined : utilizadorId) as any,
        username,
        acao,
        detalhe
      });
      await this.logRepo.save(novoLog);
    } catch (erro) {
      console.error('Erro ao registar log no sistema:', erro);
    }
  }
}