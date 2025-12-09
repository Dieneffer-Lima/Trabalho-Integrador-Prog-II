import Permissao from "../models/Permissao.js";

const PermissaoService = {
  async listarTodas() {
    return await Permissao.findAll();
  },

  async buscarPorId(id_permissao) {
    return await Permissao.findByPk(id_permissao);
  },

  async buscarPorDescricao(descricao) {
    return await Permissao.findOne({ where: { descricao } });
  },

  async criar(dados) {
    return await Permissao.create(dados);
  },

  async atualizar(id_permissao, dados) {
    const permissao = await Permissao.findByPk(id_permissao);
    if (!permissao) return null;

    await permissao.update(dados);
    return permissao;
  },

  async deletar(id_permissao) {
    const permissao = await Permissao.findByPk(id_permissao);
    if (!permissao) return false;

    await permissao.destroy();
    return true;
  }
};

export default PermissaoService;
