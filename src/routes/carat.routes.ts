import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new CaratController();

// POST /utente/:id/carat — só o utente submete o questionário
routes.post('/:id/carat', authMiddleware, autorizar(['UTENTE']), controller.submeterQuestionario.bind(controller));

// GET /utente/:id/carat — médico e utente consultam o histórico de avaliações
routes.get('/:id/carat', authMiddleware, autorizar(['UTENTE', 'MEDICO', 'ADMIN']), controller.obterHistorico.bind(controller));

// GET /carat/:evalId — detalhes de uma avaliação específica
routes.get('/:evalId', authMiddleware, autorizar(['UTENTE', 'MEDICO', 'ADMIN']), controller.obterPorId.bind(controller));

export default routes;