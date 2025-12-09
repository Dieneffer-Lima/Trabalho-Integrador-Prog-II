import ClienteService from "../services/ClienteService.js";

const ClienteController = {
  async listar(req, res) {
    try {
      const clientes = await ClienteService.listarTodos();
      return res.json(clientes);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      return res.status(500).json({ message: "Erro ao listar clientes." });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.buscarPorId(id);

      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      return res.json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
  },

  async criar(req, res) {
    try {
      const novoCliente = await ClienteService.criar(req.body);
      return res.status(201).json(novoCliente);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      return res.status(500).json({ message: "Erro ao criar cliente." });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const clienteAtualizado = await ClienteService.atualizar(id, req.body);

      if (!clienteAtualizado) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      return res.json(clienteAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return res.status(500).json({ message: "Erro ao atualizar cliente." });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagado = await ClienteService.deletar(id);

      if (!apagado) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return res.status(500).json({ message: "Erro ao deletar cliente." });
    }
  }
};

export default ClienteController;
