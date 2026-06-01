import { Router } from 'express';
import { RecomendacaoController } from '../controllers/recomendacao.controller';

const router = Router();
const controller = new RecomendacaoController();

// Listar todas as recomendações de um utente
router.get('/utente/:utenteId', controller.listarPorUtente.bind(controller));

// Marcar uma recomendação como lida (utente confirma que a viu)
router.patch('/:id/lida', controller.marcarComoLida.bind(controller));

export default router;
