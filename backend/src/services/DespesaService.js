// backend/src/services/DespesaService.js
import Despesa from "../models/Despesa.js";

const DespesaService = {
  async listarTodos() {
    return Despesa.findAll({
      order: [["data_despesa", "DESC"]],
    });
  },

  async buscarPorId(id) {
    return Despesa.findByPk(id);
  },

  async criar(dados) {
    const { categoria, descricao_despesa, valor_despesa, data_despesa } = dados;

    if (!categoria || valor_despesa == null) {
      const error = new Error("Categoria e valor são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    const nova = await Despesa.create({
      categoria,
      descricao_despesa: descricao_despesa || null,
      valor_despesa,
      data_despesa: data_despesa || new Date(),
    });

    return nova;
  },

  async atualizar(id, dados) {
    const despesa = await Despesa.findByPk(id);
    if (!despesa) return null;

    await despesa.update(dados);
    return despesa;
  },

  async deletar(id) {
    const despesa = await Despesa.findByPk(id);
    if (!despesa) return false;

    await despesa.destroy();
    return true;
  },
};

export default DespesaService;
