import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new MedicoController();

// Admin lista todos; médico consulta o seu próprio perfil por utilizadorId
routes.get('/', authMiddleware, autorizar(['ADMIN', 'MEDICO']), controller.listar.bind(controller));
// Só admin cria registos de médicos
routes.post('/', authMiddleware, autorizar(['ADMIN']), controller.criar.bind(controller));
// Admin e médico podem consultar um médico específico
routes.get('/:id', authMiddleware, autorizar(['ADMIN', 'MEDICO']), controller.obterPorId.bind(controller));
// Só admin atualiza dados de médicos
routes.put('/:id', authMiddleware, autorizar(['ADMIN']), controller.atualizar.bind(controller));
// Só admin pode eliminar
routes.delete('/:id', authMiddleware, autorizar(['ADMIN']), controller.eliminar.bind(controller));

export default routes;