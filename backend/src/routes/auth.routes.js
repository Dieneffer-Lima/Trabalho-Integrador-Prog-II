// backend/src/routes/auth.routes.js 
import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// ROTA DE LOGIN
router.post('/login', AuthController.login);

router.post('/register', AuthController.register); 

export default router;