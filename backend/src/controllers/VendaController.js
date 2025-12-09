import VendaService from "../services/VendaService.js";

const VendaController = {
  async listar(req, res) {
    try {
      const vendas = await VendaService.listarTodas();
      return res.json(vendas);
    } catch (error) {
      console.error("Erro ao listar vendas:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar vendas. Verifique o backend." });
    }
  },

  async criar(req, res) {
    try {
      console.log("Payload recebido em /vendas:", req.body);

      // O Passport/Autenticação deve injetar o ID do usuário em req.user
      const idUsuario = req.user?.id_usuario || null; 

      // 🟢 CORREÇÃO CRÍTICA: Injeta o status de pagamento ao payload para satisfazer a restrição NOT NULL do banco.
      const vendaData = {
          ...req.body,
          status_pagamento: req.body.status_pagamento || 'Pago' // Usa o que veio no body ou define 'Pago'
      };

      const novaVenda = await VendaService.registrarVenda(
        vendaData, 
        idUsuario
      );

      return res.status(201).json(novaVenda);
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      return res
        .status(500)
        .json({
          message:
            error.message ||
            "Erro ao registrar venda. Verifique o backend (/vendas).",
        });
    }
  },
};

export default VendaController;