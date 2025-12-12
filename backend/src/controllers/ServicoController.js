// backend/src/controllers/ServicoController.js

// Importa o service de serviços (CRUD no banco)
import ServicoService from "../services/ServicoService.js";

const ServicoController = {
  // Lista serviços
  async listar(req, res) {
    try {
      // Busca no banco todos os serviços
      const servicos = await ServicoService.listarTodos();

      // Retorna a lista
      return res.json(servicos);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar serviços:", error);
      return res.status(500).json({ message: "Erro ao listar serviços." });
    }
  },

  // Busca serviço por id
  async buscarPorId(req, res) {
    try {
      // Extrai o id da rota /servicos/:id
      const { id } = req.params;

      // Busca no banco
      const servico = await ServicoService.buscarPorId(id);

      // Se não existir, retorna 404
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      // Retorna o serviço encontrado
      return res.json(servico);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao buscar serviço:", error);
      return res.status(500).json({ message: "Erro ao buscar serviço." });
    }
  },

  // Cria um novo serviço
  async criar(req, res) {
    try {
      // Cria no banco usando o service (que valida nome e valor)
      const novoServico = await ServicoService.criar(req.body);

      // Retorna 201 com o registro criado
      return res.status(201).json(novoServico);
    } catch (error) {
      // Log para depuração
      console.error("Erro ao criar serviço:", error);

      // Se o service definiu statusCode (ex.: 400), devolve o mesmo status para o frontend
      if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      // Caso contrário, devolve 500
      return res.status(500).json({ message: "Erro ao criar serviço." });
    }
  },

  // Atualiza um serviço existente
  async atualizar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Atualiza no banco usando o service
      const servicoAtualizado = await ServicoService.atualizar(id, req.body);

      // Se não existir, retorna 404
      if (!servicoAtualizado) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      // Retorna o objeto atualizado
      return res.json(servicoAtualizado);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao atualizar serviço:", error);
      return res.status(500).json({ message: "Erro ao atualizar serviço." });
    }
  },

  // Deleta um serviço existente
  async deletar(req, res) {
    try {
      // Extrai id da rota
      const { id } = req.params;

      // Service tenta deletar e retorna true/false
      const apagado = await ServicoService.deletar(id);

      // Se não apagou, não existe -> 404
      if (!apagado) {
        return res.status(404).json({ message: "Serviço não encontrado." });
      }

      // 204: sucesso sem corpo
      return res.status(204).send();
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao deletar serviço:", error);
      return res.status(500).json({ message: "Erro ao deletar serviço." });
    }
  },
};

export default ServicoController;
