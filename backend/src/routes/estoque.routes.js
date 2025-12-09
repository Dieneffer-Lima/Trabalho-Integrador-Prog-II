// backend/src/routes/estoque.routes.js

import { Router } from 'express';
import EstoqueController from '../controllers/EstoqueController.js'; 

const router = Router();

router.post('/entrada', EstoqueController.adicionarEntrada); 

router.get('/', EstoqueController.listarMateriais);

export default router;