// backend/src/router.js (COMPLETO E CORRIGIDO)

import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import clienteRoutes from "./cliente.routes.js";
import materialRoutes from "./material.routes.js";
import servicoRoutes from "./servico.routes.js";
import vendaRoutes from "./vendas.routes.js";
import despesaRoutes from "./despesas.routes.js";
import notaFiscalRoutes from "./notasfiscais.routes.js";
import itemVendaRoutes from "./itemvenda.routes.js";
import permissaoRoutes from "./permissao.routes.js";
import usuarioPermissaoRoutes from "./usuariopermissao.routes.js";
import estoqueRoutes from "./estoque.routes.js"; 

const router = Router();

router.use("/auth", authRoutes);

router.use("/usuarios", usuarioRoutes);
router.use("/clientes", clienteRoutes);
router.use("/materiais", materialRoutes);
router.use("/servicos", servicoRoutes);
router.use("/vendas", vendaRoutes);
router.use("/despesas", despesaRoutes);
router.use("/notasfiscais", notaFiscalRoutes);
router.use("/itensvenda", itemVendaRoutes);
router.use("/permissoes", permissaoRoutes);
router.use("/usuariopermissao", usuarioPermissaoRoutes);
router.use("/estoque", estoqueRoutes); 

export default router;
