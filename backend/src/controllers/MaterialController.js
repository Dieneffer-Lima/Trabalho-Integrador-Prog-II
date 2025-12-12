// backend/src/controllers/MaterialController.js

// Importa o model Material diretamente para executar operações (create/findAll) no banco
import Material from "../models/Material.js";

const MaterialController = {
  // Controller responsável por criar um material (cadastro de materiais)
  async criar(req, res) {
    // Lê exatamente os campos que o frontend envia
    // Esses nomes precisam bater com os atributos do model Sequelize
    const { nome_material, descricao_material, valor_material, quant_estoque } = req.body;

    try {
      // Converte valores para números e aplica fallback para evitar null/NaN
      // parseFloat pode retornar NaN se vier vazio; "|| 0.00" garante 0
      const valorNumerico = parseFloat(valor_material) || 0.0;

      // parseInt pode retornar NaN se vier vazio; "|| 0" garante 0
      const quantidadeNumerica = parseInt(quant_estoque) || 0;

      // Validação mínima: nome do material é obrigatório
      if (!nome_material) {
        return res.status(400).json({ message: "O nome do material é obrigatório." });
      }

      // Insere o registro no banco
      const novoMaterial = await Material.create({
        nome_material: nome_material,
        descricao_material: descricao_material,
        valor_material: valorNumerico,
        quant_estoque: quantidadeNumerica,
      });

      // Retorna 201 (Created) com o material cadastrado
      return res.status(201).json(novoMaterial);
    } catch (error) {
      // Loga o erro para depuração
      console.error("Erro ao cadastrar material:", error);

      // Se o Sequelize tiver erros de validação, extrai as mensagens para devolver ao frontend
      const msg = error.errors ? error.errors.map((e) => e.message).join(", ") : "Erro interno do servidor";

      // Retorna 500 com uma mensagem mais descritiva
      return res.status(500).json({ message: `Erro ao criar material: ${msg}` });
    }
  },

  // Controller responsável por listar materiais (usado pelo estoque e pelo select no frontend)
  async listar(req, res) {
    try {
      // Busca todos os materiais cadastrados
      const materiais = await Material.findAll();

      // Retorna a lista
      return res.json(materiais);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar materiais:", error);
      return res.status(500).json({ message: "Erro interno ao buscar materiais." });
    }
  },

  // Outras funções (atualizar/deletar) podem ser adicionadas conforme necessário
};

export default MaterialController;
