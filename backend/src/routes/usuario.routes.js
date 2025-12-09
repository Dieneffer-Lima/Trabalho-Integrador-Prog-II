import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { requirePermissao, requireJWTAuth } from "../middlewares/permissoes.js";

const router = Router();

// ADMIN pode tudo
router.get("/", requirePermissao("ADMIN"), UsuarioController.listar);
router.get("/:id", requirePermissao("ADMIN"), UsuarioController.buscarPorId);
router.post("/", requirePermissao("ADMIN"), UsuarioController.criar);
router.put("/:id", requirePermissao("ADMIN"), UsuarioController.atualizar);
router.delete("/:id", requirePermissao("ADMIN"), UsuarioController.deletar);

export default router;
