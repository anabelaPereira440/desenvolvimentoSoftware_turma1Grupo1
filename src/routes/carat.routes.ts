import { Router } from 'express';
import { CaratController } from '../controllers/carat.controller';

const routes = Router();
const controller = new CaratController();

// Define as duas rotas obrigatórias para o módulo CARAT
routes.post('/:id/carat', controller.submeterQuestionario.bind(controller));
routes.get('/:id/carat', controller.obterHistorico.bind(controller));

export default routes;