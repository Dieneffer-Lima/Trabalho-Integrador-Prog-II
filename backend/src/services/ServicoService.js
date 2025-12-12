// backend/services/ServicoService.js

// Importa o model Servico, que representa a tabela de serviços no banco
import Servico from "../models/Servico.js";

const ServicoService = {
  // Lista todos os serviços cadastrados, ordenando pelo nome
  async listarTodos() {
    // SELECT * FROM servico ORDER BY nome_servico ASC;
    return Servico.findAll({
      order: [["nome_servico", "ASC"]],
    });
  },

  // Busca um serviço específico pelo ID
  async buscarPorId(id) {
    // SELECT * FROM servico WHERE id_servico = :id;
    return Servico.findByPk(id);
  },

  // Cria um serviço novo no banco
  async criar(dados) {
    // INSERT INTO servico (nome_servico, valor_servico) VALUES (:nome_servico, :valor_servico);

    // Extrai do objeto recebido apenas os campos esperados
    const { nome_servico, valor_servico } = dados;

    // Validação simples para garantir que os campos obrigatórios foram preenchidos
    if (!nome_servico || valor_servico == null) {
      const error = new Error("Nome e valor do serviço são obrigatórios.");
      // statusCode é usado para o controller devolver o código HTTP correto
      error.statusCode = 400;
      throw error;
    }

    // Cria o registro no banco
    const novo = await Servico.create({
      nome_servico,
      valor_servico,
    });

    // Retorna o registro criado (geralmente usado para atualizar a tabela no frontend)
    return novo;
  },

  // Atualiza um serviço existente
  async atualizar(id, dados) {
    // SELECT * FROM servico WHERE id_servico = :id;
    // UPDATE servico SET ... WHERE id_servico = :id;

    // Busca o registro no banco
    const servico = await Servico.findByPk(id);
    if (!servico) {
      // Se não existir, o controller pode retornar 404
      return null;
    }

    // Extrai possíveis campos de atualização
    const { nome_servico, valor_servico } = dados;

    // Atualiza apenas os campos que vierem definidos no request
    if (nome_servico !== undefined) servico.nome_servico = nome_servico;
    if (valor_servico !== undefined) servico.valor_servico = valor_servico;

    // Salva alterações no banco
    await servico.save();

    // Retorna o registro atualizado
    return servico;
  },

  // Remove um serviço do banco
  async deletar(id) {
    // DELETE FROM servico WHERE id_servico = :id;

    // destroy retorna quantas linhas foram afetadas
    const linhasAfetadas = await Servico.destroy({
      where: { id_servico: id },
    });

    // Retorna true/false para indicar se deletou algo de fato
    return linhasAfetadas > 0;
  },
};

export default ServicoService;
