// backend/src/controllers/MaterialController.js

import Material from '../models/Material.js';

const MaterialController = {
    async criar(req, res) {
        // 🚨 IMPORTANTE: Se o seu frontend estiver enviando "nome_material", "quant_estoque", etc.,
        // você precisa desestruturar esses nomes EXATOS.
        const { nome_material, descricao_material, valor_material, quant_estoque } = req.body;

        try {
            // 1. Converte strings vazias/nulas para 0 antes de enviar ao banco
            // Isso previne o erro 'cannot be null' se o campo vier vazio.
            const valorNumerico = parseFloat(valor_material) || 0.00;
            const quantidadeNumerica = parseInt(quant_estoque) || 0;
            
            if (!nome_material) {
                return res.status(400).json({ message: "O nome do material é obrigatório." });
            }

            const novoMaterial = await Material.create({
                nome_material: nome_material,
                descricao_material: descricao_material,
                valor_material: valorNumerico,
                quant_estoque: quantidadeNumerica
            });

            return res.status(201).json(novoMaterial); // Retorna 201 Created

        } catch (error) {
            console.error("Erro ao cadastrar material:", error);
            // Retorna a mensagem de erro específica do Sequelize se disponível
            const msg = error.errors ? error.errors.map(e => e.message).join(', ') : 'Erro interno do servidor';
            return res.status(500).json({ message: `Erro ao criar material: ${msg}` });
        }
    },

    // Adicione a função listar aqui para que o Estoque e o Frontend funcionem.
    async listar(req, res) {
        try {
            const materiais = await Material.findAll();
            return res.json(materiais);
        } catch (error) {
            console.error("Erro ao listar materiais:", error);
            return res.status(500).json({ message: "Erro interno ao buscar materiais." });
        }
    }
    
    // ... adicione outras funções (atualizar, deletar)
};

export default MaterialController;