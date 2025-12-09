// backend/src/controllers/DespesaController.js
import DespesaService from "../services/DespesaService.js";

const DespesaController = {
  async listar(req, res) {
    try {
      const despesas = await DespesaService.listarTodos();
      return res.json(despesas);
    } catch (error) {
      console.error("Erro ao listar despesas:", error);
      return res.status(500).json({ message: "Erro ao listar despesas." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const despesa = await DespesaService.buscarPorId(id);

      if (!despesa) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      return res.json(despesa);
    } catch (error) {
      console.error("Erro ao buscar despesa:", error);
      return res.status(500).json({ message: "Erro ao buscar despesa." });
    }
  },

  async criar(req, res) {
    try {
      console.log("REQ BODY /despesas:", req.body);

      const novaDespesa = await DespesaService.criar(req.body);
      return res.status(201).json(novaDespesa);
    } catch (error) {
      console.error("Erro ao criar despesa (detalhe):", error);

      // ⚠ Agora devolvemos a mensagem real do erro pra enxergar no front
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro ao criar despesa." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const despesaAtualizada = await DespesaService.atualizar(id, req.body);

      if (!despesaAtualizada) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      return res.json(despesaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      return res.status(500).json({ message: "Erro ao atualizar despesa." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await DespesaService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      return res.status(500).json({ message: "Erro ao deletar despesa." });
    }
  },
};

export default DespesaController;
