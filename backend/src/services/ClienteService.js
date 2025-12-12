// backend/src/services/ClienteService.js

// Importa o model Cliente, que representa a tabela de clientes no banco
import Cliente from "../models/Cliente.js";

const ClienteService = {
  // Lista todos os clientes cadastrados
  async listarTodos() {
    // SELECT * FROM cliente;
    return await Cliente.findAll();
  },

  // Busca um cliente pelo ID (chave primária)
  async buscarPorId(id_cliente) {
    // SELECT * FROM cliente WHERE id_cliente = :id_cliente;
    return await Cliente.findByPk(id_cliente);
  },

  // Cria um novo cliente no banco
  async criar(dados) {
    // INSERT INTO cliente (...) VALUES (...);
    return await Cliente.create(dados);
  },

  // Atualiza um cliente existente
  async atualizar(id_cliente, dados) {
    // Busca o cliente antes para validar se ele existe
    const cliente = await Cliente.findByPk(id_cliente);

    // Se não existir, retorna null para o controller tratar a resposta
    if (!cliente) return null;

    // Atualiza campos enviados no body
    await cliente.update(dados);

    // Retorna o cliente atualizado
    return cliente;
  },

  // Remove um cliente do banco
  async deletar(id_cliente) {
    // Busca o cliente antes de deletar para evitar erro
    const cliente = await Cliente.findByPk(id_cliente);

    // Se não existir, retorna false para indicar que nada foi removido
    if (!cliente) return false;

    // DELETE FROM cliente WHERE id_cliente = :id_cliente;
    await cliente.destroy();

    // Retorna true indicando que o registro foi removido
    return true;
  },
};

export default ClienteService;
