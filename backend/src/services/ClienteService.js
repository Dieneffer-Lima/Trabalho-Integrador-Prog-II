import Cliente from "../models/Cliente.js";

const ClienteService = {
  async listarTodos() {
    return await Cliente.findAll();
  },

  async buscarPorId(id_cliente) {
    return await Cliente.findByPk(id_cliente);
  },

  async criar(dados) {
    return await Cliente.create(dados);
  },

  async atualizar(id_cliente, dados) {
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) return null;

    await cliente.update(dados);
    return cliente;
  },

  async deletar(id_cliente) {
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) return false;

    await cliente.destroy();
    return true;
  }
};

export default ClienteService;
