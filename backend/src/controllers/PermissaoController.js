import PermissaoService from "../services/PermissaoService.js";

const PermissaoController = {
  async listar(req, res) {
    try {
      const permissoes = await PermissaoService.listarTodas();
      return res.json(permissoes);
    } catch (error) {
      console.error("Erro ao listar permissões:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar permissões." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const permissao = await PermissaoService.buscarPorId(id);

      if (!permissao) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      return res.json(permissao);
    } catch (error) {
      console.error("Erro ao buscar permissão:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar permissão." });
    }
  },

  async criar(req, res) {
    try {
      const novaPermissao = await PermissaoService.criar(req.body);
      return res.status(201).json(novaPermissao);
    } catch (error) {
      console.error("Erro ao criar permissão:", error);
      return res
        .status(500)
        .json({ message: "Erro ao criar permissão." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const permissaoAtualizada = await PermissaoService.atualizar(id, req.body);

      if (!permissaoAtualizada) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      return res.json(permissaoAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar permissão." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await PermissaoService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Permissão não encontrada." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar permissão:", error);
      return res
        .status(500)
        .json({ message: "Erro ao deletar permissão." });
    }
  }
};

export default PermissaoController;
