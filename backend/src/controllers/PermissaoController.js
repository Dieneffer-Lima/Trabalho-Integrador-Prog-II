// backend/src/controllers/PermissaoController.js

// Importa o service de permissões (CRUD de Permissao no banco)
import PermissaoService from "../services/PermissaoService.js";

const PermissaoController = {
  // Lista todas as permissões cadastradas
  async listar(req, res) {
    try {
      // Busca no banco todas as permissões
      const permissoes = await PermissaoService.listarTodas();

      // Retorna em JSON
      return res.json(permissoes);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar permissões:", error);
      return res.status(500).json({ message: "Erro ao listar permissões." });
    }
  },

  // Busca uma permissão pelo id
  async buscarPorId(req, res) {
    try {
      // Extrai o id da rota /permissoes/:id
      const { id } = req.params;

      // Busca no banco
      const permissao = await PermissaoService.buscarPorId(id);

      // Se não existir, retorna 404
      if (!permissao) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      // Retorna a permissão encontrada
      return res.json(permissao);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar permissão:", error);
      return res.status(500).json({ message: "Erro ao buscar permissão." });
    }
  },

  // Cria uma nova permissão
  async criar(req, res) {
    try {
      // Cria no banco usando o service
      const novaPermissao = await PermissaoService.criar(req.body);

      // Retorna 201 com a permissão criada
      return res.status(201).json(novaPermissao);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao criar permissão:", error);
      return res.status(500).json({ message: "Erro ao criar permissão." });
    }
  },

  // Atualiza uma permissão existente pelo id
  async atualizar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Atualiza usando o service
      const permissaoAtualizada = await PermissaoService.atualizar(id, req.body);

      // Se não existir, retorna 404
      if (!permissaoAtualizada) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      // Retorna a permissão atualizada
      return res.json(permissaoAtualizada);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar permissão:", error);
      return res.status(500).json({ message: "Erro ao atualizar permissão." });
    }
  },

  // Remove uma permissão pelo id
  async deletar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Tenta remover usando o service
      const apagado = await PermissaoService.deletar(id);

      // Se não apagou, não existe -> 404
      if (!apagado) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      // 204: sucesso sem conteúdo
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar permissão:", error);
      return res.status(500).json({ message: "Erro ao deletar permissão." });
    }
  },
};

export default PermissaoController;
