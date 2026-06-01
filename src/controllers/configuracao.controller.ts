import { Request, Response } from 'express';
import { ConfiguracaoService } from '../services/configuracao.service';

export class ConfiguracaoController {
  private service = new ConfiguracaoService();

  // GET /configuracao — consultar configuração atual (admin)
  async obter(req: Request, res: Response) {
    try {
      const config = await this.service.obterConfiguracao();
      return res.json(config);
    } catch (error: any) {
      return res.status(500).json({ erro: 'Erro ao obter configuração.', detalhe: error.message });
    }
  }

  // PUT /configuracao — atualizar parâmetros do sistema (admin)
  async atualizar(req: Request, res: Response) {
    try {
      const configAtualizada = await this.service.atualizarConfiguracao(req.body);
      return res.json({ mensagem: 'Configuração atualizada com sucesso.', configuracao: configAtualizada });
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }
}
