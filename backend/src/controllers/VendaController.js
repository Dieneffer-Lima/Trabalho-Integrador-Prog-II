// backend/src/controllers/VendaController.js

// Importa o service que faz a regra completa da venda (criação + itens + baixa de estoque)
import VendaService from "../services/VendaService.js";

const VendaController = {
  // Lista todas as vendas registradas
  async listar(req, res) {
    try {
      // Busca no banco (order DESC por id_venda está no service)
      const vendas = await VendaService.listarTodas();

      // Retorna a lista em JSON
      return res.json(vendas);
    } catch (error) {
      // Erro inesperado -> 500
      console.error("Erro ao listar vendas:", error);
      return res
        .status(500)
        .json({ message: "Erro ao listar vendas. Verifique o backend." });
    }
  },

  // Cria uma venda (registra venda e baixa estoque conforme materiais usados)
  async criar(req, res) {
    try {
      // Mostra no console o payload recebido do frontend (ajuda a depurar o formato)
      console.log("Payload recebido em /vendas:", req.body);

      // Se você estiver usando Passport JWT, ele coloca o usuário autenticado em req.user
      // Aqui pegamos o id do usuário, se existir
      const idUsuario = req.user?.id_usuario || null;

      // Monta o objeto que será enviado ao service
      // A ideia aqui é garantir que exista status_pagamento para não violar NOT NULL no banco
      const vendaData = {
        ...req.body,

        // Se o frontend não mandar status_pagamento, define um padrão
        // Observação: no seu VendaService você calcula status_pagamento como:
        // forma_pagamento === 'avista' ? 'pago' : 'pendente'
        // Então essa linha só faz sentido se o seu Model exigir status_pagamento sempre,
        // mas cuidado com o valor ('Pago' vs 'pago') para manter padrão.
        status_pagamento: req.body.status_pagamento || "Pago",
      };

      // Chama o service que faz:
      // - valida serviços
      // - calcula total
      // - cria Venda
      // - cria ItemVenda
      // - baixa Material.quant_estoque
      const novaVenda = await VendaService.registrarVenda(vendaData, idUsuario);

      // 201: venda criada com sucesso
      return res.status(201).json(novaVenda);
    } catch (error) {
      // Erro pode vir de validações do service (ex.: estoque insuficiente)
      console.error("Erro ao registrar venda:", error);

      // Retorna mensagem do erro para facilitar depuração no frontend
      return res.status(500).json({
        message:
          error.message ||
          "Erro ao registrar venda. Verifique o backend (/vendas).",
      });
    }
  },
};

export default VendaController;
