// backend/src/services/MaterialService.js

// Importa o model Material, que representa os produtos em estoque
import Material from "../models/Material.js";

const MaterialService = {
  // Lista todos os materiais cadastrados
  async listarTodos() {
    // SELECT * FROM material;
    return await Material.findAll();
  },

  // Busca um material pelo ID
  async buscarPorId(id_material) {
    // SELECT * FROM material WHERE id_material = :id_material;
    return await Material.findByPk(id_material);
  },

  // Cria um novo material no banco
  async criar(dados) {
    // INSERT INTO material (...) VALUES (...);
    return await Material.create(dados);
  },

  // Atualiza um material existente
  async atualizar(id_material, dados) {
    // SELECT * FROM material WHERE id_material = :id_material;
    const material = await Material.findByPk(id_material);

    if (!material) return null;

    // Atualiza campos enviados
    await material.update(dados);

    return material;
  },

  // Remove um material do banco
  async deletar(id_material) {
    // SELECT * FROM material WHERE id_material = :id_material;
    const material = await Material.findByPk(id_material);

    if (!material) return false;

    // DELETE FROM material WHERE id_material = :id_material;
    await material.destroy();

    return true;
  },
};

export default MaterialService;
