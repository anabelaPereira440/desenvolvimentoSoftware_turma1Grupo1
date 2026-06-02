import { Router } from 'express';
import { ExameController } from '../controllers/exame.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new ExameController();

// Médico e admin podem consultar exames
routes.get('/', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.listar.bind(controller));
// Só o médico regista exames clínicos
routes.post('/', authMiddleware, autorizar(['MEDICO']), controller.criar.bind(controller));

export default routes;