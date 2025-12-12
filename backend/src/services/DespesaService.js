// backend/src/services/DespesaService.js

// Importa o model Despesa, que representa a tabela de despesas no banco
import Despesa from "../models/Despesa.js";

const DespesaService = {
  // Lista todas as despesas cadastradas, ordenando da mais recente para a mais antiga
  async listarTodos() {
    // SELECT * FROM despesa ORDER BY data_despesa DESC;
    return Despesa.findAll({
      order: [["data_despesa", "DESC"]],
    });
  },

  // Busca uma despesa pelo ID (chave primária)
  async buscarPorId(id) {
    // SELECT * FROM despesa WHERE id_despesa = :id;
    return Despesa.findByPk(id);
  },

  // Cria uma nova despesa no banco
  async criar(dados) {
    // Extrai os campos que o frontend envia no body da requisição
    const { categoria, descricao_despesa, valor_despesa, data_despesa } = dados;

    // Validação mínima: categoria e valor são obrigatórios para registrar uma despesa
    if (!categoria || valor_despesa == null) {
      // Cria um erro com statusCode para o controller conseguir responder adequadamente
      const error = new Error("Categoria e valor são obrigatórios.");
      error.statusCode = 400;
      throw error;
    }

    // Insere o registro no banco; campos opcionais recebem null ou valor padrão
    const nova = await Despesa.create({
      categoria,
      // Se não vier descrição, salva como null para manter consistência no banco
      descricao_despesa: descricao_despesa || null,
      valor_despesa,
      // Se não vier data, usa a data atual (Date) como padrão
      data_despesa: data_despesa || new Date(),
    });

    // Retorna o objeto criado (o Sequelize inclui o ID e os valores persistidos)
    return nova;
  },

  // Atualiza uma despesa existente
  async atualizar(id, dados) {
    // Busca a despesa no banco antes de atualizar
    const despesa = await Despesa.findByPk(id);

    // Se não existir, retorna null para o controller responder 404 ou similar
    if (!despesa) return null;

    // Atualiza apenas os campos recebidos em "dados"
    await despesa.update(dados);

    // Retorna o objeto atualizado
    return despesa;
  },

  // Remove uma despesa do banco
  async deletar(id) {
    // Busca primeiro para garantir que existe antes de tentar deletar
    const despesa = await Despesa.findByPk(id);

    // Se não existir, retorna false para o controller informar que não removeu nada
    if (!despesa) return false;

    // Executa o DELETE no banco para remover o registro
    await despesa.destroy();

    // Retorna true indicando que a remoção aconteceu
    return true;
  },
};

export default DespesaService;
