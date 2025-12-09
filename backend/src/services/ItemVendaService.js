import ItemVenda from "../models/ItemVenda.js";

const ItemVendaService = {
  async listarPorVenda(id_venda) {
    return await ItemVenda.findAll({ where: { id_venda } });
  },

  async buscarPorId(id_item_venda) {
    return await ItemVenda.findByPk(id_item_venda);
  },

  async criar(dados) {
    return await ItemVenda.create(dados);
  },

  async atualizar(id_item_venda, dados) {
    const item = await ItemVenda.findByPk(id_item_venda);
    if (!item) return null;

    await item.update(dados);
    return item;
  },

  async deletar(id_item_venda) {
    const item = await ItemVenda.findByPk(id_item_venda);
    if (!item) return false;

    await item.destroy();
    return true;
  }
};

export default ItemVendaService;
