import { Router } from 'express';
import { MedicoController } from '../controllers/medico.controller';

const routes = Router();
const controller = new MedicoController();

routes.get('/', controller.listar.bind(controller));
routes.post('/', controller.criar.bind(controller));
routes.get('/:id', controller.obterPorId.bind(controller));
routes.put('/:id', controller.atualizar.bind(controller));
routes.delete('/:id', controller.eliminar.bind(controller));

export default routes;