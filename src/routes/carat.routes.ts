import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';

const routes = Router();
const controller = new CaratController();

// POST /utente/:id/carat — submeter questionário
routes.post('/:id/carat', controller.submeterQuestionario.bind(controller));

// GET /utente/:id/carat — histórico de avaliações do utente
routes.get('/:id/carat', controller.obterHistorico.bind(controller));

// GET /carat/:evalId — detalhes de uma avaliação específica (montado em /carat no app.ts)
routes.get('/:evalId', controller.obterPorId.bind(controller));

export default routes;