import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/configuracao.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const router = Router();
const controller = new ConfiguracaoController();

// GET /configuracao — todos os perfis autenticados consultam (utente usa para o dashboard)
router.get('/', authMiddleware, autorizar(['ADMIN', 'MEDICO', 'UTENTE']), controller.obter.bind(controller));

// PUT /configuracao — só admin atualiza os parâmetros do sistema
router.put('/', authMiddleware, autorizar(['ADMIN']), controller.atualizar.bind(controller));

export default router;
