import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const router = Router();
const controller = new AuthController();

// Públicas
router.post('/login', controller.login.bind(controller));
router.post('/register', controller.registar.bind(controller));

// Protegida — só admin pode ver os logs
router.get('/logs', authMiddleware, autorizar(['ADMIN']),
  controller.listarLogs.bind(controller));

export default router;