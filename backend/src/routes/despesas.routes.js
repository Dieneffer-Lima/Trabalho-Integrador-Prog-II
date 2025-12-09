// backend/src/routes/despesas.routes.js
import { Router } from "express";
import DespesaController from "../controllers/DespesaController.js";

const router = Router();

// ⚠ Sem autenticação por enquanto, pra não dar erro de JWT
router.get("/", DespesaController.listar);
router.get("/:id", DespesaController.buscarPorId);
router.post("/", DespesaController.criar);
router.put("/:id", DespesaController.atualizar);
router.delete("/:id", DespesaController.deletar);

export default router;
