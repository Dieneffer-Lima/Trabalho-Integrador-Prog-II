// backend/src/services/VendaService.js

import sequelize from "../config/database.js";
import Venda from "../models/Venda.js";
import ItemVenda from "../models/ItemVenda.js";
import Servico from "../models/Servico.js";
import Material from "../models/Material.js";

const VendaService = {
  async listarTodas() {
    const vendas = await Venda.findAll({
      order: [["id_venda", "DESC"]],
    });
    return vendas;
  },

  /**
   * Formato esperado do frontend:
   *
   * {
   *   data_venda: "2025-12-10",
   *   tipo_pagamento: "avista" | "aprazo",
   *   forma_pagamento: "debito" | "credito" | "dinheiro",
   *
   *   itens_servico: [
   *     { id_servico: 1, quantidade: 1 },
   *   ],
   *
   *   materiais_utilizados: [
   *     { id_servico: 1, id_material: 1, quantidade: 1 },
   *   ]
   * }
   */
  async registrarVenda(dadosVenda, idUsuario) {
    console.log("DEBUG - dadosVenda recebidos (service):", dadosVenda);

    // ====== DATA ======
    const data_venda =
      dadosVenda.data_venda ||
      dadosVenda.dataVenda ||
      new Date().toISOString().slice(0, 10);

    // ====== PAGAMENTO ======
    const tipoPagamentoFront =
      dadosVenda.tipo_pagamento || dadosVenda.tipoPagamento;
    const forma_pagamento = tipoPagamentoFront || "avista";

    const metodo_pagamento =
      dadosVenda.forma_pagamento || dadosVenda.formaPagamento || "dinheiro";

    if (!forma_pagamento) {
      throw new Error("Forma de pagamento não informada.");
    }

    // status: se for à vista, já marca pago; se for a prazo, pendente
    const status_pagamento =
      forma_pagamento === "avista" ? "pago" : "pendente";

    // ====== SERVIÇOS ======
    let servicosRaw =
      dadosVenda.servicos ||
      dadosVenda.servicosSelecionados ||
      dadosVenda.itens ||
      dadosVenda.itensVenda ||
      dadosVenda.itens_servico; // principal do seu front

    if (servicosRaw && !Array.isArray(servicosRaw)) {
      servicosRaw = [servicosRaw];
    }

    const servicos = servicosRaw || [];

    if (!servicos.length) {
      throw new Error("Nenhum serviço informado para a venda.");
    }

    // ====== MATERIAIS UTILIZADOS ======
    const materiaisGlobais =
      dadosVenda.materiais_utilizados || dadosVenda.materiaisUtilizados || [];

    const t = await sequelize.transaction();

    try {
      let totalVenda = 0;
      const itensParaCriar = [];
      const movimentosEstoque = []; // { id_material, quantidade }

      // 1) valida serviços e prepara dados
      for (const s of servicos) {
        const { id_servico } = s;
        const qtdServico = Number(
          s.quantidadeServico ?? s.quantidade_servico ?? s.quantidade ?? 0
        );

        if (!id_servico || !qtdServico || qtdServico <= 0) {
          throw new Error("Serviço ou quantidade de serviço inválidos.");
        }

        const servicoDB = await Servico.findByPk(id_servico, {
          transaction: t,
        });

        if (!servicoDB) {
          throw new Error(`Serviço ID ${id_servico} não encontrado.`);
        }

        const valorUnit = parseFloat(servicoDB.valor_servico) || 0;
        const totalServico = valorUnit * qtdServico;
        totalVenda += totalServico;

        itensParaCriar.push({
          id_servico,
          quantidade_servico: qtdServico,
          valor_unitario_servico: valorUnit,
        });

        // materiais ligados a esse serviço
        const materiaisDoServico = materiaisGlobais.filter(
          (m) => Number(m.id_servico) === Number(id_servico)
        );

        for (const m of materiaisDoServico) {
          const { id_material } = m;
          const qtdMat = Number(
            m.quantidadeMaterial ?? m.quantidade_material ?? m.quantidade ?? 0
          );

          if (!id_material || !qtdMat || qtdMat <= 0) continue;

          const materialDB = await Material.findByPk(id_material, {
            transaction: t,
          });

          if (!materialDB) {
            throw new Error(`Material ID ${id_material} não encontrado.`);
          }

          const estoqueAtual = Number(materialDB.quant_estoque) || 0;
          const consumoTotal = qtdMat * qtdServico;

          if (estoqueAtual < consumoTotal) {
            throw new Error(
              `Estoque insuficiente para o material "${materialDB.nome_material}".`
            );
          }

          movimentosEstoque.push({
            id_material,
            quantidade: consumoTotal,
          });
        }
      }

      // 2) cria a venda (agora com status_pagamento e metodo_pagamento)
      const venda = await Venda.create(
        {
          data_venda,
          forma_pagamento,
          status_pagamento,
          metodo_pagamento,
          total_venda: totalVenda,
          id_usuario: idUsuario || null,
          id_cliente: null,
        },
        { transaction: t }
      );

      // 3) itens da venda
      for (const item of itensParaCriar) {
        await ItemVenda.create(
          {
            id_venda: venda.id_venda,
            id_servico: item.id_servico,
            quantidade_servico: item.quantidade_servico,
            valor_unitario_servico: item.valor_unitario_servico,
          },
          { transaction: t }
        );
      }

      // 4) baixa no estoque
      for (const mov of movimentosEstoque) {
        await Material.decrement("quant_estoque", {
          by: mov.quantidade,
          where: { id_material: mov.id_material },
          transaction: t,
        });
      }

      await t.commit();
      console.log("DEBUG - venda registrada com sucesso:", venda.toJSON());
      return venda;
    } catch (err) {
      await t.rollback();
      console.error("Erro ao registrar venda (service):", err);
      throw err;
    }
  },
};

export default VendaService;
