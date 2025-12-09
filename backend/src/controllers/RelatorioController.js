// backend/src/controllers/RelatorioController.js

import RelatorioService from "../services/RelatorioService.js";

const RelatorioController = {
    
    // Controlador para Vendas Brutas
    async getVendasBrutas(req, res) {
        try {
            const relatorio = await RelatorioService.calcularVendasBrutas();
            return res.status(200).json(relatorio);
        } catch (error) {
            console.error('Erro no controller de Vendas Brutas:', error.message);
            // Retorna 500 para o frontend
            return res.status(500).json({ 
                mensagem: 'Erro interno ao processar o relatório de vendas brutas.' 
            });
        }
    },

};

export default RelatorioController;