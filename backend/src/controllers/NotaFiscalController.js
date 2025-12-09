import NotaFiscalService from "../services/NotaFiscalService.js";

const NotaFiscalController = {
  async listar(req, res) {
    try {
      const notas = await NotaFiscalService.listarTodas();
      return res.json(notas);
    } catch (error) {
      console.error("Erro ao listar notas fiscais:", error);
      return res.status(500).json({ message: "Erro ao listar notas fiscais." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const nota = await NotaFiscalService.buscarPorId(id);

      if (!nota) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      return res.json(nota);
    } catch (error) {
      console.error("Erro ao buscar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao buscar nota fiscal." });
    }
  },

  async criar(req, res) {
    try {
      const novaNota = await NotaFiscalService.criar(req.body);
      return res.status(201).json(novaNota);
    } catch (error) {
      console.error("Erro ao criar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao criar nota fiscal." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const notaAtualizada = await NotaFiscalService.atualizar(id, req.body);

      if (!notaAtualizada) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      return res.json(notaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao atualizar nota fiscal." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await NotaFiscalService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao deletar nota fiscal." });
    }
  }
};

export default NotaFiscalController;
