import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const controller = new AdminController();

router.delete('/simulados', controller.limparSimulados.bind(controller));

export default router;
