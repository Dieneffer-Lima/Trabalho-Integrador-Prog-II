// backend/src/services/NotaFiscalService.js

// Importa o model NotaFiscal, responsável pela tabela de notas fiscais
import NotaFiscal from "../models/NotaFiscal.js";
// Importa o model Venda para buscar informações da venda vinculada
import Venda from "../models/Venda.js";
// Importa operadores do Sequelize para filtros avançados
import { Op } from "sequelize";

const NotaFiscalService = {
  // Cria uma nova nota fiscal vinculada a uma venda existente
  async criar(dadosNota) {
    console.log("DEBUG - dadosNota recebidos (service):", dadosNota);

    const { id_venda } = dadosNota;

    // Valida se o ID da venda foi informado
    if (!id_venda) {
      throw new Error("id_venda da nota fiscal não foi informado.");
    }

    // Busca a venda no banco para garantir que ela existe
    const venda = await Venda.findByPk(id_venda);

    if (!venda) {
      throw new Error("Venda associada à nota fiscal não encontrada.");
    }

    // Define valores padrão para campos opcionais
    const quantidade_servicos =
      dadosNota.quantidade_servicos != null
        ? Number(dadosNota.quantidade_servicos)
        : 1;

    const valor_total_venda =
      dadosNota.valor_total_venda != null
        ? Number(dadosNota.valor_total_venda)
        : Number(venda.total_venda || 0);

    // Cria a nota fiscal no banco
    const nota = await NotaFiscal.create({
      id_venda,
      numero_nota: dadosNota.numero_nota || null,
      data_emissao: dadosNota.data_emissao || null,
      data_prevista_pagamento: dadosNota.data_prevista_pagamento || null,
      status_pagamento: dadosNota.status_pagamento || "pendente",
      quantidade_servicos,
      valor_total_venda,
      observacoes: dadosNota.observacoes || null,
    });

    return nota;
  },

  // Lista todas as notas fiscais cadastradas
  async listarTodas() {
    // SELECT * FROM nota_fiscal ORDER BY data_emissao DESC;
    return await NotaFiscal.findAll({
      order: [["data_emissao", "DESC"]],
    });
  },

  // Busca uma nota fiscal pelo ID
  async buscarPorId(id_nota) {
    const nota = await NotaFiscal.findByPk(id_nota);

    if (!nota) {
      throw new Error("Nota fiscal não encontrada.");
    }

    return nota;
  },

  // Busca notas fiscais aplicando filtros opcionais
  async buscarPorFiltros({ nome_cliente, data_emissao, data_prevista }) {
    const where = {};

    // Filtro por nome do cliente usando LIKE
    if (nome_cliente) {
      where.nome_cliente = { [Op.iLike]: `%${nome_cliente}%` };
    }

    // Filtro por data de emissão
    if (data_emissao) {
      where.data_emissao = data_emissao;
    }

    // Filtro por data prevista de pagamento
    if (data_prevista) {
      where.data_prevista_pagamento = data_prevista;
    }

    return await NotaFiscal.findAll({
      where,
      order: [["data_emissao", "DESC"]],
    });
  },

  // Atualiza o status de pagamento de uma nota fiscal
  async atualizarStatus(id_nota, { status_pagamento, data_pagamento }) {
    const nota = await NotaFiscal.findByPk(id_nota);

    if (!nota) {
      throw new Error("Nota fiscal não encontrada.");
    }

    // Atualiza apenas os campos enviados
    if (status_pagamento) nota.status_pagamento = status_pagamento;
    if (data_pagamento) nota.data_pagamento = data_pagamento;

    await nota.save();

    return nota;
  },
};

export default NotaFiscalService;
