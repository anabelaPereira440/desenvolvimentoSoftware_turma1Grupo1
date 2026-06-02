import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new UtenteController();

// Admin, médico e utente podem listar (cada um filtra pelo seu contexto)
routes.get('/', authMiddleware, autorizar(['ADMIN', 'MEDICO', 'UTENTE']), controller.listar.bind(controller));
// Só admin cria registos de utentes
routes.post('/', authMiddleware, autorizar(['ADMIN']), controller.criar.bind(controller));
// Admin, médico e utente podem consultar um utente específico
routes.get('/:id', authMiddleware, autorizar(['ADMIN', 'MEDICO', 'UTENTE']), controller.obterPorId.bind(controller));
// Admin atualiza qualquer utente; utente atualiza os seus próprios dados
routes.put('/:id', authMiddleware, autorizar(['ADMIN', 'UTENTE']), controller.atualizar.bind(controller));
// Só admin pode eliminar
routes.delete('/:id', authMiddleware, autorizar(['ADMIN']), controller.eliminar.bind(controller));

export default routes;