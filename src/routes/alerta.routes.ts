import { Router } from 'express';
import { AlertaController } from '../controllers/alerta.controller';

const routes = Router();
const controller = new AlertaController();

// Criar um novo alerta clínico (Tipo de alerta automático do BreathCare)
routes.post('/', controller.criar.bind(controller));

// Listar alertas com filtros opcionais (medicoResponsavelId, estado, prioridade)
routes.get('/', controller.listar.bind(controller));

// Listar todos os alertas clínicos pertencentes a um utente específico
routes.get('/utente/:utenteId', controller.listarPorUtente.bind(controller));

// Consultar os detalhes e justificação de um alerta específico pelo ID
routes.get('/:id', controller.obterPorId.bind(controller));

// Permitir que o médico altere o estado ou atualize a prioridade do alerta
routes.patch('/:id', controller.atualizar.bind(controller));

export default routes;