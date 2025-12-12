// backend/src/controllers/ItemVendaController.js

// Importa o service de ItemVenda, que faz as operações no banco para itens de venda
import ItemVendaService from "../services/ItemVendaService.js";

const ItemVendaController = {
  // Lista todos os itens de uma venda específica (rota /itensvenda/venda/:id_venda, por exemplo)
  async listarPorVenda(req, res) {
    try {
      // Extrai o id da venda dos parâmetros da rota
      const { id_venda } = req.params;

      // Busca no banco os itens onde id_venda bate com o parâmetro
      const itens = await ItemVendaService.listarPorVenda(id_venda);

      // Retorna a lista de itens
      return res.json(itens);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar itens da venda:", error);
      return res.status(500).json({ message: "Erro ao listar itens da venda." });
    }
  },

  // Busca um item de venda específico pelo id
  async buscarPorId(req, res) {
    try {
      // Extrai o id do item da rota /itensvenda/:id
      const { id } = req.params;

      // Busca no banco pelo id (PK)
      const item = await ItemVendaService.buscarPorId(id);

      // Se não encontrar, retorna 404
      if (!item) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      // Se encontrar, retorna o registro
      return res.json(item);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar item de venda:", error);
      return res.status(500).json({ message: "Erro ao buscar item de venda." });
    }
  },

  // Cria um novo item de venda
  async criar(req, res) {
    try {
      // Envia o body diretamente para o service criar no banco
      const novoItem = await ItemVendaService.criar(req.body);

      // Retorna 201 (Created) com o item criado
      return res.status(201).json(novoItem);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao criar item de venda:", error);
      return res.status(500).json({ message: "Erro ao criar item de venda." });
    }
  },

  // Atualiza um item de venda pelo id
  async atualizar(req, res) {
    try {
      // Extrai id do item a ser atualizado
      const { id } = req.params;

      // Pede para o service atualizar no banco usando req.body
      const itemAtualizado = await ItemVendaService.atualizar(id, req.body);

      // Se não achar o item, retorna 404
      if (!itemAtualizado) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      // Se atualizar, retorna o item atualizado
      return res.json(itemAtualizado);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar item de venda:", error);
      return res.status(500).json({ message: "Erro ao atualizar item de venda." });
    }
  },

  // Deleta um item de venda pelo id
  async deletar(req, res) {
    try {
      // Extrai id do item a ser removido
      const { id } = req.params;

      // Service tenta remover do banco e retorna true/false
      const apagado = await ItemVendaService.deletar(id);

      // Se não apagou, item não existe -> 404
      if (!apagado) {
        return res.status(404).json({ message: "Item de venda não encontrado." });
      }

      // 204 indica sucesso sem corpo de resposta
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar item de venda:", error);
      return res.status(500).json({ message: "Erro ao deletar item de venda." });
    }
  },
};

export default ItemVendaController;

