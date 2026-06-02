import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { autorizar } from '../middleware/autorizar.middleware';

const routes = Router();
const controller = new AlertaController();

// Criar um novo alerta clínico (gerado pelo sistema via avaliação CARAT)
routes.post('/', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.criar.bind(controller));

// Listar alertas com filtros opcionais (medicoResponsavelId, estado, prioridade)
routes.get('/', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.listar.bind(controller));

// Listar todos os alertas clínicos pertencentes a um utente específico
routes.get('/utente/:utenteId', authMiddleware, autorizar(['UTENTE', 'MEDICO', 'ADMIN']), controller.listarPorUtente.bind(controller));

// Consultar os detalhes e justificação de um alerta específico pelo ID
routes.get('/:id', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.obterPorId.bind(controller));

// Permitir que o médico altere o estado ou atualize a prioridade do alerta
routes.patch('/:id', authMiddleware, autorizar(['MEDICO', 'ADMIN']), controller.atualizar.bind(controller));

export default routes;