// backend/src/services/PermissaoService.js

// Importa o model Permissao, que representa a tabela de permissões do sistema
import Permissao from "../models/Permissao.js";

const PermissaoService = {
  // Retorna todas as permissões cadastradas
  async listarTodas() {
    // SELECT * FROM permissao;
    return await Permissao.findAll();
  },

  // Busca uma permissão pelo seu ID
  async buscarPorId(id_permissao) {
    // SELECT * FROM permissao WHERE id_permissao = :id_permissao;
    return await Permissao.findByPk(id_permissao);
  },

  // Busca uma permissão pela descrição textual
  // Usado quando se quer localizar permissões por nome
  async buscarPorDescricao(descricao) {
    // SELECT * FROM permissao WHERE descricao = :descricao LIMIT 1;
    return await Permissao.findOne({ where: { descricao } });
  },

  // Cria uma nova permissão no banco
  async criar(dados) {
    // INSERT INTO permissao (...) VALUES (...);
    return await Permissao.create(dados);
  },

  // Atualiza uma permissão existente
  async atualizar(id_permissao, dados) {
    // SELECT * FROM permissao WHERE id_permissao = :id_permissao;
    const permissao = await Permissao.findByPk(id_permissao);

    // Se não existir, retorna null para o controller tratar
    if (!permissao) return null;

    // Atualiza os campos enviados
    await permissao.update(dados);

    // Retorna a permissão atualizada
    return permissao;
  },

  // Remove uma permissão do banco
  async deletar(id_permissao) {
    // SELECT * FROM permissao WHERE id_permissao = :id_permissao;
    const permissao = await Permissao.findByPk(id_permissao);

    // Se não existir, nada é removido
    if (!permissao) return false;

    // DELETE FROM permissao WHERE id_permissao = :id_permissao;
    await permissao.destroy();

    return true;
  },
};

export default PermissaoService;
