// backend/src/services/RelatorioService.js

// Importa apenas o model Venda, pois o relatório de vendas brutas
// depende somente dos valores registrados nas vendas
import { Venda } from "../models/index.js";

// Define explicitamente o nome da coluna que armazena o valor total da venda
// Isso evita erro caso o nome da coluna seja alterado futuramente
const COLUNA_VALOR_BRUTO = "total_venda";

const RelatorioService = {
  // Função responsável por calcular o total bruto de vendas
  // Ou seja, a soma de todos os valores registrados em vendas
  async calcularVendasBrutas() {
    try {
      // Usa a função SUM do Sequelize para somar a coluna total_venda
      // Equivale a: SELECT SUM(total_venda) FROM vendas;
      const resultado = await Venda.sum(COLUNA_VALOR_BRUTO);

      // Caso não exista nenhuma venda, o retorno pode ser null
      // Nesse caso, o valor total é considerado 0
      const valorTotalBruto = resultado || 0;

      // Retorna o valor formatado e uma descrição do cálculo
      return {
        valor_total: parseFloat(valorTotalBruto.toFixed(2)),
        detalhes:
          "Soma total dos valores de venda registrados na coluna total_venda.",
      };
    } catch (error) {
      // Loga o erro no servidor para facilitar depuração
      console.error("Erro no service ao calcular vendas brutas:", error);

      // Lança um erro genérico para o controller tratar e responder ao frontend
      throw new Error(
        "Falha ao acessar o banco de dados para vendas brutas."
      );
    }
  },
};

export default RelatorioService;
