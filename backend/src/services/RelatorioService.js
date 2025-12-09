// backend/src/services/RelatorioService.js

// Importa apenas o modelo Venda, pois o cálculo bruto só precisa dele.
import { Venda } from '../models/index.js'; 

// Nome real da coluna de valor total da Venda
const COLUNA_VALOR_BRUTO = 'total_venda'; 

const RelatorioService = {
    // ----------------------------------------------------
    // 1. CÁLCULO BRUTO (Soma simples de todos os valores de venda)
    // ----------------------------------------------------
    async calcularVendasBrutas() {
        try {
            // Usa a função SUM do Sequelize na coluna total_venda
            const resultado = await Venda.sum(COLUNA_VALOR_BRUTO);

            const valorTotalBruto = resultado || 0;

            return {
                valor_total: parseFloat(valorTotalBruto.toFixed(2)),
                detalhes: 'Soma total dos valores de venda registrados na coluna total_venda.'
            };

        } catch (error) {
            console.error('Erro no service ao calcular vendas brutas:', error);
            // Lança um erro padronizado para o Controller
            throw new Error('Falha ao acessar o banco de dados para vendas brutas.');
        }
    },

    // A função calcularVendasLiquidas foi removida
};

export default RelatorioService;