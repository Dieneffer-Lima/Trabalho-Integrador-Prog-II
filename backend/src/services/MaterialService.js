import Material from "../models/Material.js";

const MaterialService = {
  async listarTodos() {
    return await Material.findAll();
  },

  async buscarPorId(id_material) {
    return await Material.findByPk(id_material);
  },

  async criar(dados) {
    return await Material.create(dados);
  },

  async atualizar(id_material, dados) {
    const material = await Material.findByPk(id_material);
    if (!material) {
      return null;
    }
    await material.update(dados);
    return material;
  },

  async deletar(id_material) {
    const material = await Material.findByPk(id_material);
    if (!material) {
      return false;
    }
    await material.destroy();
    return true;
  }
};

export default MaterialService;