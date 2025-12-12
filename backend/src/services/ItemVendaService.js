// backend/src/services/ItemVendaService.js

// Importa o model ItemVenda, que representa os serviços associados a uma venda
import ItemVenda from "../models/ItemVenda.js";

const ItemVendaService = {
  // Lista todos os itens de uma venda específica
  async listarPorVenda(id_venda) {
    // SELECT * FROM item_venda WHERE id_venda = :id_venda;
    return await ItemVenda.findAll({ where: { id_venda } });
  },

  // Busca um item de venda pelo ID
  async buscarPorId(id_item_venda) {
    // SELECT * FROM item_venda WHERE id_item_venda = :id_item_venda;
    return await ItemVenda.findByPk(id_item_venda);
  },

  // Cria um novo item de venda
  async criar(dados) {
    // INSERT INTO item_venda (...) VALUES (...);
    return await ItemVenda.create(dados);
  },

  // Atualiza um item de venda existente
  async atualizar(id_item_venda, dados) {
    const item = await ItemVenda.findByPk(id_item_venda);
    if (!item) return null;

    await item.update(dados);

    return item;
  },

  // Remove um item de venda
  async deletar(id_item_venda) {
    const item = await ItemVenda.findByPk(id_item_venda);
    if (!item) return false;

    await item.destroy();

    return true;
  },
};

export default ItemVendaService;
