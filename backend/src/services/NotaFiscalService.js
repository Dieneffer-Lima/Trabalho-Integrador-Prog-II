// backend/src/services/NotaFiscalService.js

import NotaFiscal from "../models/NotaFiscal.js";
import Venda from "../models/Venda.js";
import { Op } from "sequelize";

const NotaFiscalService = {
  /**
   * Cria uma nova nota fiscal vinculada a uma venda.
   * - id_venda é obrigatório
   * - quantidade_servicos e valor_total_venda recebem valores padrão
   *   se não vierem no body
   */
  async criar(dadosNota) {
    console.log("DEBUG - dadosNota recebidos (service):", dadosNota);

    const { id_venda } = dadosNota;

    if (!id_venda) {
      throw new Error("id_venda da nota fiscal não foi informado.");
    }

    // Busca a venda para puxar o total, se necessário
    const venda = await Venda.findByPk(id_venda);

    if (!venda) {
      throw new Error("Venda associada à nota fiscal não encontrada.");
    }

    // Nome do cliente: se não vier, usa um padrão para não quebrar o NOT NULL
    const nome_cliente =
      dadosNota.nome_cliente && dadosNota.nome_cliente.trim()
        ? dadosNota.nome_cliente.trim()
        : "Cliente não informado";

    // Se não vier quantidade_servicos, usa 1 como padrão
    const quantidade_servicos =
      dadosNota.quantidade_servicos != null
        ? Number(dadosNota.quantidade_servicos)
        : 1;

    // Se não vier valor_total_venda, usa o total da venda
    const valor_total_venda =
      dadosNota.valor_total_venda != null
        ? Number(dadosNota.valor_total_venda)
        : Number(venda.total_venda || 0);

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

  /** Lista todas as notas fiscais */
  async listarTodas() {
    return await NotaFiscal.findAll({
      order: [["data_emissao", "DESC"]],
    });
  },

  /** Busca uma nota pelo id */
  async buscarPorId(id_nota) {
    const nota = await NotaFiscal.findByPk(id_nota);
    if (!nota) {
      throw new Error("Nota fiscal não encontrada.");
    }
    return nota;
  },

  /**
   * Busca notas por filtros simples:
   * - nome_cliente
   * - data_emissao
   * - data_prevista_pagamento
   */
  async buscarPorFiltros({ nome_cliente, data_emissao, data_prevista }) {
    const where = {};

    if (nome_cliente) {
      where.nome_cliente = { [Op.iLike]: `%${nome_cliente}%` };
    }

    if (data_emissao) {
      where.data_emissao = data_emissao;
    }

    if (data_prevista) {
      where.data_prevista_pagamento = data_prevista;
    }

    return await NotaFiscal.findAll({
      where,
      order: [["data_emissao", "DESC"]],
    });
  },

  /** Atualiza status de pagamento e, opcionalmente, data de pagamento */
  async atualizarStatus(id_nota, { status_pagamento, data_pagamento }) {
    const nota = await NotaFiscal.findByPk(id_nota);
    if (!nota) {
      throw new Error("Nota fiscal não encontrada.");
    }

    if (status_pagamento) {
      nota.status_pagamento = status_pagamento;
    }
    if (data_pagamento) {
      nota.data_pagamento = data_pagamento;
    }

    await nota.save();
    return nota;
  },
};

export default NotaFiscalService;
