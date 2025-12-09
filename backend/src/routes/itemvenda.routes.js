import { Router } from "express";
import ItemVendaController from "../controllers/ItemVendaController.js";
import { requireJWTAuth } from "../middlewares/permissoes.js";

const router = Router();

router.get("/venda/:id_venda", requireJWTAuth, ItemVendaController.listarPorVenda);
router.get("/:id", requireJWTAuth, ItemVendaController.buscarPorId);

router.post("/", requireJWTAuth, ItemVendaController.criar);
router.put("/:id", requireJWTAuth, ItemVendaController.atualizar);
router.delete("/:id", requireJWTAuth, ItemVendaController.deletar);

export default router;
