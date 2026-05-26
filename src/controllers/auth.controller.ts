// Controller responsável pela Autenticação e Auditoria.
// Recebe as credenciais enviadas no pedido HTTP, chama o AuthService
// para validar ou registar o utilizador e devolve o token JWT + dados básicos.

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  // Instanciação única e limpa do Serviço de Autenticação
  private authService = new AuthService();

  // Utilização de Arrow Functions (= async (req, res) =>) para garantir 
  // que o 'this.authService' nunca se perde durante a execução das rotas.
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password } = req.body;
      
      // Validação rápida de payload antes de chamar a lógica de negócio
      if (!username || !password) {
        return res.status(400).json({ erro: 'Username e password são obrigatórios.' });
      }

      const resultado = await this.authService.login(username, password);

      return res.status(200).json({
        mensagem: 'Login efetuado com sucesso.',
        ...resultado // Inclui o token e o objeto user { id, nome, username, role }
      });
    } catch (error: any) {
      // Resposta padrão para falha de credenciais (401 Unauthorized)
      return res.status(401).json({ erro: error.message });
    }
  };

  registar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { nome, username, password, role } = req.body;
      
      const resultado = await this.authService.registar(nome, username, password, role);

      return res.status(201).json({
        mensagem: 'Utilizador registado com sucesso.',
        ...resultado
      });
    } catch (error: any) {
      // Erro de validação de input ou utilizador já existente (400 Bad Request)
      return res.status(400).json({ erro: error.message });
    }
  };

  listarLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const logs = await this.authService.listarLogs();
      return res.status(200).json(logs);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao consultar logs.' });
    }
  };
}