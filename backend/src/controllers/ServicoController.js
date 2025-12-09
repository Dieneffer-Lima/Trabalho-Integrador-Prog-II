// backend/controllers/ServicoController.js
import ServicoService from "../services/ServicoService.js";

const ServicoController = {
  async listar(req, res) {
    try {
      const servicos = await ServicoService.listarTodos();
      return res.json(servicos);
    } catch (error) {
      console.error("Erro ao listar serviços:", error);
      return res.status(500).json({ message: "Erro ao listar serviços." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const servico = await ServicoService.buscarPorId(id);

      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      return res.json(servico);
    } catch (error) {
      console.error("Erro ao buscar serviço:", error);
      return res.status(500).json({ message: "Erro ao buscar serviço." });
    }
  },

  async criar(req, res) {
    try {
      const novoServico = await ServicoService.criar(req.body);
      return res.status(201).json(novoServico);
    } catch (error) {
      console.error("Erro ao criar serviço:", error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao criar serviço." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const servicoAtualizado = await ServicoService.atualizar(id, req.body);

      if (!servicoAtualizado) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      return res.json(servicoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      return res.status(500).json({ message: "Erro ao atualizar serviço." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await ServicoService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      return res.status(500).json({ message: "Erro ao deletar serviço." });
    }
  },
};

export default ServicoController;
