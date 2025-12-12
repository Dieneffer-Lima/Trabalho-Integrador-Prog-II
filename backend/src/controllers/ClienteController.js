// backend/src/controllers/ClienteController.js

// Importa o service de Cliente, que contém as operações de banco (findAll, findByPk, create, update, destroy)
import ClienteService from "../services/ClienteService.js";

const ClienteController = {
  // Lista todos os clientes
  async listar(req, res) {
    try {
      // Busca a lista completa no banco
      const clientes = await ClienteService.listarTodos();

      // Retorna a lista em JSON
      return res.json(clientes);
    } catch (error) {
      // Se falhar (banco, bug, etc.), responde 500
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ message: "Erro ao listar clientes." });
    }
  },

  // Busca um cliente específico pelo ID (vem pela URL /clientes/:id)
  async buscarPorId(req, res) {
    try {
      // Extrai o parâmetro :id da rota
      const { id } = req.params;

      // Busca o cliente no banco
      const cliente = await ClienteService.buscarPorId(id);

      // Se não achou, retorna 404
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // Se achou, retorna o registro
      return res.json(cliente);
    } catch (error) {
      // Erro inesperado
      console.error("Erro ao buscar cliente:", error);
      return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
  },

  // Cria um novo cliente
  async criar(req, res) {
    try {
      // req.body contém os campos do cliente enviados pelo frontend
      const novoCliente = await ClienteService.criar(req.body);

      // Retorna 201 (Created) com o registro criado
      return res.status(201).json(novoCliente);
    } catch (error) {
      // Erro inesperado
      console.error("Erro ao criar cliente:", error);
      return res.status(500).json({ message: "Erro ao criar cliente." });
    }
  },

  // Atualiza um cliente existente (rota /clientes/:id)
  async atualizar(req, res) {
    try {
      // Pega o id a ser atualizado
      const { id } = req.params;

      // Envia o id e os dados para o service atualizar
      const clienteAtualizado = await ClienteService.atualizar(id, req.body);

      // Se não existir, service retorna null -> 404
      if (!clienteAtualizado) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // Retorna o cliente atualizado
      return res.json(clienteAtualizado);
    } catch (error) {
      // Erro inesperado
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({ message: "Erro ao atualizar cliente." });
    }
  },

  // Remove um cliente do banco (rota /clientes/:id)
  async deletar(req, res) {
    try {
      // Pega o id do cliente a ser removido
      const { id } = req.params;

      // Service tenta apagar e retorna true/false
      const apagado = await ClienteService.deletar(id);

      // Se não apagou, é porque não encontrou
      if (!apagado) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      // 204 (No Content) indica que apagou com sucesso e não há corpo na resposta
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({ message: "Erro ao deletar cliente." });
    }
  },
};

export default ClienteController;
