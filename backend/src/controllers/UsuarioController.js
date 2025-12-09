import UsuarioService from "../services/UsuarioService.js";

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioService.listarTodos();
      return res.json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Erro ao listar usuários." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.json(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro ao buscar usuário." });
    }
  },

  async criar(req, res) {
    try {
      const novoUsuario = await UsuarioService.criar(req.body);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro ao criar usuário." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuarioAtualizado = await UsuarioService.atualizar(id, req.body);

      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await UsuarioService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ message: "Erro ao deletar usuário." });
    }
  }
};

export default UsuarioController;
