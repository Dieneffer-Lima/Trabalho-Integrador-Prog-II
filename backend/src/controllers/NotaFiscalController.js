// backend/src/controllers/NotaFiscalController.js

// Importa o service que contém as regras e chamadas ao banco relacionadas a NotaFiscal
import NotaFiscalService from "../services/NotaFiscalService.js";

const NotaFiscalController = {
  // Lista todas as notas fiscais
  async listar(req, res) {
    try {
      // Busca todas as notas no banco (ordenação e filtros ficam no service)
      const notas = await NotaFiscalService.listarTodas();

      // Retorna a lista em JSON
      return res.json(notas);
    } catch (error) {
      // Qualquer erro inesperado -> 500
      console.error("Erro ao listar notas fiscais:", error);
      return res.status(500).json({ message: "Erro ao listar notas fiscais." });
    }
  },

  // Busca uma nota fiscal específica pelo id
  async buscarPorId(req, res) {
    try {
      // Extrai o id vindo da rota /notas-fiscais/:id
      const { id } = req.params;

      // Busca a nota no banco
      const nota = await NotaFiscalService.buscarPorId(id);

      // Se não existir, retorna 404
      // Observação: dependendo do service, ele pode lançar erro ao invés de retornar null
      if (!nota) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      // Retorna a nota encontrada
      return res.json(nota);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao buscar nota fiscal." });
    }
  },

  // Cria uma nova nota fiscal
  async criar(req, res) {
    try {
      // Envia o body para o service validar e criar no banco
      const novaNota = await NotaFiscalService.criar(req.body);

      // Retorna 201 (Created) com a nota criada
      return res.status(201).json(novaNota);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao criar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao criar nota fiscal." });
    }
  },

  // Atualiza uma nota fiscal existente pelo id
  async atualizar(req, res) {
    try {
      // Extrai o id da rota
      const { id } = req.params;

      // Pede para o service atualizar a nota com os campos do body
      // Observação: no seu service que você mandou, não existe atualizar/deletar.
      // Este controller só funciona se esses métodos existirem no service.
      const notaAtualizada = await NotaFiscalService.atualizar(id, req.body);

      // Se não achou a nota, retorna 404
      if (!notaAtualizada) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      // Retorna a nota atualizada
      return res.json(notaAtualizada);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao atualizar nota fiscal." });
    }
  },

  // Deleta uma nota fiscal pelo id
  async deletar(req, res) {
    try {
      // Extrai o id da rota
      const { id } = req.params;

      // Pede para o service deletar a nota
      // Observação: no seu service que você mandou, não existe deletar.
      // Este controller só funciona se esse método existir no service.
      const apagado = await NotaFiscalService.deletar(id);

      // Se não apagou, é porque não achou a nota
      if (!apagado) {
        return res.status(404).json({ message: "Nota fiscal não encontrada." });
      }

      // 204 significa sucesso sem corpo de resposta
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar nota fiscal:", error);
      return res.status(500).json({ message: "Erro ao deletar nota fiscal." });
    }
  },
};

export default NotaFiscalController;

