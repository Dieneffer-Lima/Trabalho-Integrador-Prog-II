// backend/src/controllers/UsuarioPermissaoController.js

// Importa o service responsável por operar a tabela de relação UsuarioPermissao
import UsuarioPermissaoService from "../services/UsuarioPermissaoService.js";

const UsuarioPermissaoController = {
  // Lista as permissões de um usuário específico
  async listarPermissoes(req, res) {
    try {
      // Pega o id do usuário vindo da rota (ex.: /usuarios/:id_usuario/permissoes)
      const { id_usuario } = req.params;

      // Busca no banco todas as relações UsuarioPermissao desse usuário (com include da Permissao)
      const permissoes = await UsuarioPermissaoService.listarPermissoesDoUsuario(
        id_usuario
      );

      // Retorna a lista em JSON
      return res.json(permissoes);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar permissões do usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar permissões do usuário." });
    }
  },

  // Cria a relação usuário -> permissão (atribuir permissão ao usuário)
  async atribuir(req, res) {
    try {
      // id do usuário vem na URL
      const { id_usuario } = req.params;

      // id da permissão vem no corpo da requisição
      const { id_permissao } = req.body;

      // Validação simples: sem id_permissao não tem como criar a relação
      if (!id_permissao) {
        return res
          .status(400)
          .json({ message: "id_permissao é obrigatório." });
      }

      // Cria a relação na tabela UsuarioPermissao
      const relacao = await UsuarioPermissaoService.atribuirPermissao(
        id_usuario,
        id_permissao
      );

      // 201: criado com sucesso
      return res.status(201).json(relacao);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atribuir permissão ao usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atribuir permissão ao usuário." });
    }
  },

  // Remove a relação usuário -> permissão (revogar permissão do usuário)
  async remover(req, res) {
    try {
      // Aqui os dois ids vêm na rota (ex.: /usuarios/:id_usuario/permissoes/:id_permissao)
      const { id_usuario, id_permissao } = req.params;

      // Tenta encontrar e destruir a relação UsuarioPermissao
      const removido = await UsuarioPermissaoService.removerPermissao(
        id_usuario,
        id_permissao
      );

      // Se não encontrou a relação, retorna 404
      if (!removido) {
        return res.status(404).json({
          message: "Permissão não encontrada para este usuário.",
        });
      }

      // 204: removido com sucesso, sem corpo
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao remover permissão do usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao remover permissão do usuário." });
    }
  },
};

export default UsuarioPermissaoController;
