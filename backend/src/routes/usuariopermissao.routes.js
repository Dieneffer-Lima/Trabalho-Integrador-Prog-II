import { Router } from "express";
import UsuarioPermissaoController from "../controllers/UsuarioPermissaoController.js";
import { requirePermissao } from "../middlewares/permissoes.js";

const router = Router();

// ADMIN atribui permissões aos usuários
router.get("/:id_usuario", requirePermissao("ADMIN"), UsuarioPermissaoController.listarPermissoes);
router.post("/:id_usuario", requirePermissao("ADMIN"), UsuarioPermissaoController.atribuir);
router.delete("/:id_usuario/:id_permissao", requirePermissao("ADMIN"), UsuarioPermissaoController.remover);

export default router;
