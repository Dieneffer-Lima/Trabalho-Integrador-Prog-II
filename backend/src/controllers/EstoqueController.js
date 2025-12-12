// backend/src/controllers/EstoqueController.js

// Importa o service de materiais para manipular dados do estoque (buscar/listar/atualizar material)
import MaterialService from "../services/MaterialService.js";

const EstoqueController = {
  // Controller responsável por registrar entrada (aumentar estoque) de um material
  // Rota esperada: POST /api/estoque/entrada
  async adicionarEntrada(req, res) {
    // Extrai id do material e quantidade que deve ser adicionada ao estoque
    const { id_material, quantidade } = req.body;

    // Validação de entrada: id_material obrigatório e quantidade deve ser número > 0
    // Observação: se o frontend enviar quantidade como string, typeof será "string" e cairá no 400
    if (!id_material || typeof quantidade !== "number" || quantidade <= 0) {
      return res.status(400).json({
        message: "ID do material e quantidade válida (maior que 0) são obrigatórios.",
      });
    }

    try {
      // Busca o material no banco para garantir que existe e para ler o estoque atual
      const material = await MaterialService.buscarPorId(id_material);

      // Se não encontrar material, retorna 404
      if (!material) {
        return res.status(404).json({ message: "Material não encontrado." });
      }

      // Calcula novo estoque somando a quantidade recebida ao estoque atual
      const novaQuantidade = material.quant_estoque + quantidade;

      // Atualiza o material no banco com o novo quant_estoque
      await MaterialService.atualizar(id_material, {
        quant_estoque: novaQuantidade,
      });

      // Retorna 200 com mensagem e material (inclui o valor atualizado de quant_estoque)
      return res.status(200).json({
        message: `Entrada de ${quantidade} unidades registrada com sucesso. Novo estoque: ${novaQuantidade}.`,
        material: { ...material.toJSON(), quant_estoque: novaQuantidade },
      });
    } catch (error) {
      // Se algo falhar (banco, erro no service etc.) retorna 500
      console.error("Erro ao registrar entrada de estoque:", error);
      return res.status(500).json({ message: "Erro interno ao processar a entrada de estoque." });
    }
  },

  // Controller para listar materiais (estoque atual)
  // Rota esperada: GET /api/estoque/
  async listarMateriais(req, res) {
    try {
      // Lista todos os materiais no banco (cada material tem quant_estoque)
      const materiais = await MaterialService.listarTodos();

      // Retorna a lista em JSON
      return res.json(materiais);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar materiais no Estoque:", error);
      return res.status(500).json({ message: "Erro interno ao buscar lista de estoque." });
    }
  },
};

export default EstoqueController;
