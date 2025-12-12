// backend/src/controllers/RelatorioController.js

// Importa o service que calcula os valores do relatório (consulta agregada no banco)
import RelatorioService from "../services/RelatorioService.js";

const RelatorioController = {
  // Endpoint para retornar o relatório de Vendas Brutas
  async getVendasBrutas(req, res) {
    try {
      // Chama o service que executa o SUM(total_venda) no banco via Sequelize
      const relatorio = await RelatorioService.calcularVendasBrutas();

      // Retorna 200 com o objeto do relatório (valor_total + detalhes)
      return res.status(200).json(relatorio);
    } catch (error) {
      // Loga a mensagem de erro para depuração
      console.error("Erro no controller de Vendas Brutas:", error.message);

      // Retorna 500 para o frontend quando não consegue processar o relatório
      return res.status(500).json({
        mensagem: "Erro interno ao processar o relatório de vendas brutas.",
      });
    }
  },
};

export default RelatorioController;
