import { Router } from "express";
import ServicoController from "../controllers/ServicoController.js";

const router = Router();

// ⚠️ Sem autenticação por enquanto (para não dar erro de "jwt strategy")
router.get("/", ServicoController.listar);
router.get("/:id", ServicoController.buscarPorId);
router.post("/", ServicoController.criar);
router.put("/:id", ServicoController.atualizar);
router.delete("/:id", ServicoController.deletar);

export default router;
