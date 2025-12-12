// backend/src/controllers/UsuarioController.js

// Importa o service de usuários (operações no banco)
import UsuarioService from "../services/UsuarioService.js";

const UsuarioController = {
  // Lista usuários
  async listar(req, res) {
    try {
      // Busca todos os usuários no banco
      const usuarios = await UsuarioService.listarTodos();

      // Retorna a lista
      return res.json(usuarios);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Erro ao listar usuários." });
    }
  },

  // Busca usuário por id
  async buscarPorId(req, res) {
    try {
      // Extrai id da rota /usuarios/:id
      const { id } = req.params;

      // Busca no banco pelo id (PK)
      const usuario = await UsuarioService.buscarPorId(id);

      // Se não existir, retorna 404
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna o usuário
      return res.json(usuario);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro ao buscar usuário." });
    }
  },

  // Cria um usuário
  async criar(req, res) {
    try {
      // Cria usuário no banco via service (normalmente faz hash da senha)
      const novoUsuario = await UsuarioService.criar(req.body);

      // Retorna 201 com o usuário criado
      return res.status(201).json(novoUsuario);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ message: "Erro ao criar usuário." });
    }
  },

  // Atualiza um usuário existente
  async atualizar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Atualiza usando o service
      // Observação: no service que você mandou, não existe atualizar.
      // Este controller só funciona se esse método existir no UsuarioService.
      const usuarioAtualizado = await UsuarioService.atualizar(id, req.body);

      // Se não achar, retorna 404
      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna o usuário atualizado
      return res.json(usuarioAtualizado);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar usuário:", error);
      return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  },

  // Deleta um usuário
  async deletar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Service tenta deletar e retorna true/false
      // Observação: no service que você mandou, não existe deletar.
      // Este controller só funciona se esse método existir no UsuarioService.
      const apagado = await UsuarioService.deletar(id);

      // Se não apagou, não existe -> 404
      if (!apagado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // 204: sucesso sem corpo
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ message: "Erro ao deletar usuário." });
    }
  },
};

export default UsuarioController;
