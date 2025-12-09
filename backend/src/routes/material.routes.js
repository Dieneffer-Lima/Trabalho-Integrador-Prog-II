// backend/src/routes/material.routes.js
import { Router } from 'express';
import MaterialController from '../controllers/MaterialController.js'; 

const router = Router();

router.post('/', MaterialController.criar); 
router.get('/', MaterialController.listar); 

export default router;