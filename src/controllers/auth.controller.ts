// Controller responsável pelo login.
// Recebe as credenciais enviadas no pedido HTTP, chama o AuthService
// para validar o utilizador e devolve o token JWT em caso de sucesso.
// Se a autenticação falhar, responde com erro 401.

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class LoginController {
    private authService = new AuthService();

    login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            const token = this.authService.login(username, password);

            return res.status(200).json({
                mensagem: 'Login com sucesso',
                token
            });
        } catch (error: any) {
            return res.status(401).json({
                erro: error.message
            });
        }
    }
}

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const resultado = await this.authService.login(username, password);

      return res.status(200).json({
        mensagem: 'Login efetuado com sucesso.',
        ...resultado
      });
    } catch (error: any) {
      return res.status(401).json({ erro: error.message });
    }
  }

  async registar(req: Request, res: Response) {
    try {
      const { nome, username, password, role } = req.body;
      const resultado = await this.authService.registar(nome, username, password, role);

      return res.status(201).json({
        mensagem: 'Utilizador registado com sucesso.',
        ...resultado
      });
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listarLogs(req: Request, res: Response) {
    try {
      const logs = await this.authService.listarLogs();
      return res.status(200).json(logs);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao consultar logs.' });
    }
  }
}