// backend/src/routes/notasFiscais.routes.js
import { Router } from "express";
import NotaFiscalController from "../controllers/NotaFiscalController.js";

const router = Router();

router.post("/", NotaFiscalController.criar);
router.get("/", NotaFiscalController.listar);

export default router;
