// backend/src/routes/relatorio.routes.js

import { Router } from 'express';
import RelatorioController from '../controllers/RelatorioController.js'; 

const relatorioRouter = Router();

// Rota: GET /api/relatorios/vendas/bruto (Única rota de relatório)
relatorioRouter.get('/vendas/bruto', RelatorioController.getVendasBrutas);

export default relatorioRouter;