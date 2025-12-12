// backend/src/controllers/DespesaController.js

// Importa o service de despesas, que centraliza as operações no banco (CRUD)
import DespesaService from "../services/DespesaService.js";

const DespesaController = {
  // Controller que lista todas as despesas cadastradas
  async listar(req, res) {
    try {
      // Busca no banco todas as despesas (ordenadas no service)
      const despesas = await DespesaService.listarTodos();

      // Retorna a lista em JSON
      return res.json(despesas);
    } catch (error) {
      // Se ocorrer falha de banco, bug, etc., retorna 500
      console.error("Erro ao listar despesas:", error);
      return res.status(500).json({ message: "Erro ao listar despesas." });
    }
  },

  // Controller que busca uma despesa específica pelo id vindo da rota /despesas/:id
  async buscarPorId(req, res) {
    try {
      // Extrai o id dos parâmetros da URL
      const { id } = req.params;

      // Busca no banco a despesa pelo id
      const despesa = await DespesaService.buscarPorId(id);

      // Se não existir, responde 404
      if (!despesa) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      // Se existir, responde com o registro
      return res.json(despesa);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar despesa:", error);
      return res.status(500).json({ message: "Erro ao buscar despesa." });
    }
  },

  // Controller que cria uma nova despesa
  async criar(req, res) {
    try {
      // Log para conferir o que o frontend enviou no body
      console.log("REQ BODY /despesas:", req.body);

      // Chama o service para validar e inserir a despesa no banco
      const novaDespesa = await DespesaService.criar(req.body);

      // Retorna 201 (Created) com o objeto criado
      return res.status(201).json(novaDespesa);
    } catch (error) {
      // Log do erro completo para depuração
      console.error("Erro ao criar despesa (detalhe):", error);

      // Se o service tiver colocado statusCode (ex.: 400), devolve ele para o frontend
      // Caso contrário, devolve 500
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Erro ao criar despesa." });
    }
  },

  // Controller que atualiza uma despesa existente pelo id da rota
  async atualizar(req, res) {
    try {
      // Pega o id vindo da URL /despesas/:id
      const { id } = req.params;

      // Pede para o service atualizar no banco com os dados do body
      const despesaAtualizada = await DespesaService.atualizar(id, req.body);

      // Se não achou a despesa, o service retorna null -> 404
      if (!despesaAtualizada) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      // Retorna o registro atualizado
      return res.json(despesaAtualizada);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar despesa:", error);
      return res.status(500).json({ message: "Erro ao atualizar despesa." });
    }
  },

  // Controller que remove (deleta) uma despesa existente pelo id da rota
  async deletar(req, res) {
    try {
      // Pega o id vindo da URL /despesas/:id
      const { id } = req.params;

      // Service tenta deletar e retorna true/false
      const apagado = await DespesaService.deletar(id);

      // Se não apagou, é porque não encontrou a despesa
      if (!apagado) {
        return res.status(404).json({ message: "Despesa não encontrada." });
      }

      // 204 significa "apagou com sucesso e não há corpo de resposta"
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar despesa:", error);
      return res.status(500).json({ message: "Erro ao deletar despesa." });
    }
  },
};

export default DespesaController;
