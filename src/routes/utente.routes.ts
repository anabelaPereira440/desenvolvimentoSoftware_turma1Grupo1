import { Router } from 'express';
import { UtenteController } from '../controllers/utente.controller';

const routes = Router();
const controller = new UtenteController();

routes.get('/', controller.listar.bind(controller));
routes.post('/', controller.criar.bind(controller));


export default routes;