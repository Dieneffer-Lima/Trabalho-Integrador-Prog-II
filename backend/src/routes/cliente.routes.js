import { Router } from "express";
import ClienteController from "../controllers/ClienteController.js";
import { requireJWTAuth } from "../middlewares/permissoes.js";

const router = Router();

router.get("/", requireJWTAuth, ClienteController.listar);
router.get("/:id", requireJWTAuth, ClienteController.buscarPorId);
router.post("/", requireJWTAuth, ClienteController.criar);
router.put("/:id", requireJWTAuth, ClienteController.atualizar);
router.delete("/:id", requireJWTAuth, ClienteController.deletar);

export default router;
