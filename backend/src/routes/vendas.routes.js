// backend/src/routes/vendas.routes.js
import { Router } from "express";
import { requireJWTAuth } from "../middlewares/permissoes.js";
import VendaController from "../controllers/VendaController.js";

const router = Router();

router.get("/", requireJWTAuth, VendaController.listar);
router.post("/", requireJWTAuth, VendaController.criar);

export default router;
