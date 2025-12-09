import ItemVendaService from "../services/ItemVendaService.js";

const ItemVendaController = {
  async listarPorVenda(req, res) {
    try {
      const { id_venda } = req.params;
      const itens = await ItemVendaService.listarPorVenda(id_venda);
      return res.json(itens);
    } catch (error) {
      console.error("Erro ao listar itens da venda:", error);
      return res.status(500).json({ message: "Erro ao listar itens da venda." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const item = await ItemVendaService.buscarPorId(id);

      if (!item) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      return res.json(item);
    } catch (error) {
      console.error("Erro ao buscar item de venda:", error);
      return res.status(500).json({ message: "Erro ao buscar item de venda." });
    }
  },

  async criar(req, res) {
    try {
      const novoItem = await ItemVendaService.criar(req.body);
      return res.status(201).json(novoItem);
    } catch (error) {
      console.error("Erro ao criar item de venda:", error);
      return res.status(500).json({ message: "Erro ao criar item de venda." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const itemAtualizado = await ItemVendaService.atualizar(id, req.body);

      if (!itemAtualizado) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      return res.json(itemAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar item de venda:", error);
      return res.status(500).json({ message: "Erro ao atualizar item de venda." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await ItemVendaService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar item de venda:", error);
      return res.status(500).json({ message: "Erro ao deletar item de venda." });
    }
  }
};

export default ItemVendaController;
