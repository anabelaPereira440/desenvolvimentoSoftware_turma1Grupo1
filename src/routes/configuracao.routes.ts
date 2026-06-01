import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/configuracao.controller';

const router = Router();
const controller = new ConfiguracaoController();

// GET  /configuracao — consultar parâmetros atuais (admin)
router.get('/', controller.obter.bind(controller));

// PUT  /configuracao — atualizar parâmetros (admin)
router.put('/', controller.atualizar.bind(controller));

export default router;
