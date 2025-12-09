import UsuarioPermissaoService from "../services/UsuarioPermissaoService.js";

const UsuarioPermissaoController = {
  async listarPermissoes(req, res) {
    try {
      const { id_usuario } = req.params;
      const permissoes = await UsuarioPermissaoService.listarPermissoesDoUsuario(
        id_usuario
      );
      return res.json(permissoes);
    } catch (error) {
      console.error("Erro ao listar permissões do usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar permissões do usuário." });
    }
  },

  async atribuir(req, res) {
    try {
      const { id_usuario } = req.params;
      const { id_permissao } = req.body;

      if (!id_permissao) {
        return res
          .status(400)
          .json({ message: "id_permissao é obrigatório." });
      }

      const relacao = await UsuarioPermissaoService.atribuirPermissao(
        id_usuario,
        id_permissao
      );

      return res.status(201).json(relacao);
    } catch (error) {
      console.error("Erro ao atribuir permissão ao usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atribuir permissão ao usuário." });
    }
  },

  async remover(req, res) {
    try {
      const { id_usuario, id_permissao } = req.params;

      const removido = await UsuarioPermissaoService.removerPermissao(
        id_usuario,
        id_permissao
      );

      if (!removido) {
        return res.status(404).json({
          message: "Permissão não encontrada para este usuário."
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao remover permissão do usuário:", error);
      return res
        .status(500)
        .json({ message: "Erro ao remover permissão do usuário." });
    }
  }
};

export default UsuarioPermissaoController;
