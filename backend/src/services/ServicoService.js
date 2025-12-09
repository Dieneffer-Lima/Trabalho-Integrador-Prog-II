// backend/services/ServicoService.js
import Servico from "../models/Servico.js";

const ServicoService = {
  async listarTodos() {
    return Servico.findAll({
      order: [["nome_servico", "ASC"]],
    });
  },

  async buscarPorId(id) {
    return Servico.findByPk(id);
  },

  async criar(dados) {
    const { nome_servico, valor_servico } = dados;

    if (!nome_servico || valor_servico == null) {
      const error = new Error("Nome e valor do serviço são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    const novo = await Servico.create({
      nome_servico,
      valor_servico,
    });

    return novo;
  },

  async atualizar(id, dados) {
    const servico = await Servico.findByPk(id);
    if (!servico) {
      return null;
    }

    const { nome_servico, valor_servico } = dados;

    if (nome_servico !== undefined) servico.nome_servico = nome_servico;
    if (valor_servico !== undefined) servico.valor_servico = valor_servico;

    await servico.save();
    return servico;
  },

  async deletar(id) {
    const linhasAfetadas = await Servico.destroy({
      where: { id_servico: id },
    });
    return linhasAfetadas > 0;
  },
};

export default ServicoService;
