import { Router } from 'express';
import { PrescricaoController } from '../controllers/prescricao.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new PrescricaoController();

// Médico e admin podem consultar prescrições
routes.get('/', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.listar.bind(controller));
// Só o médico regista prescrições
routes.post('/', authMiddleware, autorizar(['MEDICO']), controller.criar.bind(controller));

export default routes;