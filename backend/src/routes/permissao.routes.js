import { Router } from "express";
import PermissaoController from "../controllers/PermissaoController.js";
import { requirePermissao } from "../middlewares/permissoes.js";

const router = Router();

// apenas ADMIN pode gerenciar permissões
router.get("/", requirePermissao("ADMIN"), PermissaoController.listar);
router.get("/:id", requirePermissao("ADMIN"), PermissaoController.buscarPorId);
router.post("/", requirePermissao("ADMIN"), PermissaoController.criar);
router.put("/:id", requirePermissao("ADMIN"), PermissaoController.atualizar);
router.delete("/:id", requirePermissao("ADMIN"), PermissaoController.deletar);

export default router;
