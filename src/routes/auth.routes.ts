import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const router = Router();
const controller = new AuthController();

// Pública
router.post('/login', controller.login.bind(controller));

// Protegida — qualquer utilizador autenticado pode terminar sessão
router.post('/logout', authMiddleware, controller.logout.bind(controller));

// Protegida — só admin pode registar novos utilizadores
router.post('/register', authMiddleware, autorizar(['ADMIN']),
  controller.registar.bind(controller));

// Protegida — só admin pode ver os logs
router.get('/logs', authMiddleware, autorizar(['ADMIN']),
  controller.listarLogs.bind(controller));

// Protegida — só admin pode alterar o perfil de um utilizador
router.patch('/utilizador/:id', authMiddleware, autorizar(['ADMIN']),
  controller.alterarRole.bind(controller));

export default router;