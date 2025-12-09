// backend/src/controllers/EstoqueController.js

import MaterialService from '../services/MaterialService.js';

const EstoqueController = {
    // ROTA: POST /api/estoque/entrada - Adicionar Produto ao Estoque
    async adicionarEntrada(req, res) {
        const { id_material, quantidade } = req.body;

        if (!id_material || typeof quantidade !== 'number' || quantidade <= 0) {
            return res.status(400).json({ message: "ID do material e quantidade válida (maior que 0) são obrigatórios." });
        }

        try {
            // 1. Busca o material existente
            const material = await MaterialService.buscarPorId(id_material);

            if (!material) {
                return res.status(404).json({ message: "Material não encontrado." });
            }

            // 2. Calcula a nova quantidade, adicionando o valor recebido
            const novaQuantidade = material.quant_estoque + quantidade;

            // 3. Atualiza o estoque no banco de dados
            await MaterialService.atualizar(id_material, {
                quant_estoque: novaQuantidade
            });

            // 4. Retorna sucesso
            return res.status(200).json({ 
                message: `Entrada de ${quantidade} unidades registrada com sucesso. Novo estoque: ${novaQuantidade}.`,
                material: {...material.toJSON(), quant_estoque: novaQuantidade} 
            });

        } catch (error) {
            console.error("Erro ao registrar entrada de estoque:", error);
            return res.status(500).json({ message: "Erro interno ao processar a entrada de estoque." });
        }
    },

    // ROTA: GET /api/estoque/ (Listagem do estoque)
    async listarMateriais(req, res) {
        try {
            const materiais = await MaterialService.listarTodos();
            return res.json(materiais);
        } catch (error) {
            console.error("Erro ao listar materiais no Estoque:", error);
            return res.status(500).json({ message: "Erro interno ao buscar lista de estoque." });
        }
    }
};

export default EstoqueController;