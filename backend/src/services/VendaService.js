// backend/src/services/VendaService.js

import sequelize from "../config/database.js"; // Acesso ao sequelize para abrir transações (transaction)
import Venda from "../models/Venda.js"; // Model Venda (tabela de vendas)
import ItemVenda from "../models/ItemVenda.js"; // Model ItemVenda (itens/serviços vinculados a uma venda)
import Servico from "../models/Servico.js"; // Model Servico (tabela de serviços com nome e valor)
import Material from "../models/Material.js"; // Model Material (tabela de materiais com estoque)

const VendaService = {
  // Busca todas as vendas cadastradas no banco, ordenando pela mais recente (id maior primeiro)
  async listarTodas() {
    const vendas = await Venda.findAll({
      order: [["id_venda", "DESC"]],
    });
    return vendas;
  },

  // Registra uma venda completa usando transação:
  // 1) valida serviços e calcula total
  // 2) valida/baixa estoque de materiais usados pelos serviços
  // 3) cria a venda
  // 4) cria os itens da venda (ItemVenda)
  // 5) aplica decremento no estoque
  async registrarVenda(dadosVenda, idUsuario) {
    // Log para depurar o formato do payload enviado pelo frontend
    console.log("DEBUG - dadosVenda recebidos (service):", dadosVenda);

    // Define a data da venda:
    // tenta usar diferentes chaves para tolerar variações do frontend
    // se nenhuma vier, usa a data atual no formato YYYY-MM-DD
    const data_venda =
      dadosVenda.data_venda ||
      dadosVenda.dataVenda ||
      new Date().toISOString().slice(0, 10);

    // Define a forma/tipo de pagamento:
    // tenta pegar campos alternativos e usa "avista" por padrão
    const tipoPagamentoFront =
      dadosVenda.tipo_pagamento || dadosVenda.tipoPagamento;
    const forma_pagamento = tipoPagamentoFront || "avista";

    // Define método de pagamento para vendas à vista:
    // se não vier, assume "dinheiro"
    const metodo_pagamento =
      dadosVenda.forma_pagamento || dadosVenda.formaPagamento || "dinheiro";

    // Validação mínima: a venda precisa ter forma_pagamento definida
    if (!forma_pagamento) {
      throw new Error("Forma de pagamento não informada.");
    }

    // Define status do pagamento automaticamente:
    // à vista -> pago
    // a prazo -> pendente
    const status_pagamento = forma_pagamento === "avista" ? "pago" : "pendente";

    // Recupera os serviços enviados no payload:
    // o código aceita vários nomes possíveis para compatibilidade,
    // mas o formato principal esperado do frontend é dadosVenda.itens_servico
    let servicosRaw =
      dadosVenda.servicos ||
      dadosVenda.servicosSelecionados ||
      dadosVenda.itens ||
      dadosVenda.itensVenda ||
      dadosVenda.itens_servico;

    // Se vier um único objeto, transforma em array para padronizar o processamento
    if (servicosRaw && !Array.isArray(servicosRaw)) {
      servicosRaw = [servicosRaw];
    }

    // Garante que servicos seja um array (ou vazio)
    const servicos = servicosRaw || [];

    // Não existe venda sem ao menos um serviço
    if (!servicos.length) {
      throw new Error("Nenhum serviço informado para a venda.");
    }

    // Materiais usados em cada serviço:
    // o frontend envia como uma lista global (com id_servico apontando para qual serviço)
    const materiaisGlobais =
      dadosVenda.materiais_utilizados || dadosVenda.materiaisUtilizados || [];

    // Abre uma transação:
    // se qualquer etapa falhar, tudo é revertido (venda, itens e atualização de estoque)
    const t = await sequelize.transaction();

    try {
      // totalVenda será calculado somando preço do serviço * quantidade
      let totalVenda = 0;

      // itensParaCriar acumula os itens que depois serão inseridos na tabela ItemVenda
      const itensParaCriar = [];

      // movimentosEstoque acumula os materiais que precisam ser baixados do estoque
      // cada item possui id_material e a quantidade total a decrementar
      const movimentosEstoque = [];

      // Percorre os serviços da venda para validar e calcular valores
      for (const s of servicos) {
        const { id_servico } = s;

        // Determina quantidade do serviço aceitando variações de nome de campo
        const qtdServico = Number(
          s.quantidadeServico ?? s.quantidade_servico ?? s.quantidade ?? 0
        );

        // Valida se há serviço e quantidade > 0
        if (!id_servico || !qtdServico || qtdServico <= 0) {
          throw new Error("Serviço ou quantidade de serviço inválidos.");
        }

        // Busca o serviço no banco para pegar o valor oficial do serviço
        const servicoDB = await Servico.findByPk(id_servico, {
          transaction: t,
        });

        // Se o serviço não existir, não é possível continuar
        if (!servicoDB) {
          throw new Error(`Serviço ID ${id_servico} não encontrado.`);
        }

        // Calcula total deste serviço e soma no total geral da venda
        const valorUnit = parseFloat(servicoDB.valor_servico) || 0;
        const totalServico = valorUnit * qtdServico;
        totalVenda += totalServico;

        // Prepara o item da venda que será salvo em ItemVenda
        itensParaCriar.push({
          id_servico,
          quantidade_servico: qtdServico,
          valor_unitario_servico: valorUnit,
        });

        // Filtra quais materiais do payload pertencem ao serviço atual
        const materiaisDoServico = materiaisGlobais.filter(
          (m) => Number(m.id_servico) === Number(id_servico)
        );

        // Para cada material vinculado ao serviço, calcula consumo total e valida estoque
        for (const m of materiaisDoServico) {
          const { id_material } = m;

          // Determina quantidade do material aceitando variações de nome de campo
          const qtdMat = Number(
            m.quantidadeMaterial ?? m.quantidade_material ?? m.quantidade ?? 0
          );

          // Se não tiver id ou quantidade válida, ignora essa linha
          if (!id_material || !qtdMat || qtdMat <= 0) continue;

          // Busca o material no banco para validar estoque e nome do material
          const materialDB = await Material.findByPk(id_material, {
            transaction: t,
          });

          // Se não encontrar, não dá para dar baixa no estoque
          if (!materialDB) {
            throw new Error(`Material ID ${id_material} não encontrado.`);
          }

          // Estoque atual do banco
          const estoqueAtual = Number(materialDB.quant_estoque) || 0;

          // Consumo total do material depende da quantidade do material por serviço
          // multiplicada pela quantidade de serviços vendidos
          const consumoTotal = qtdMat * qtdServico;

          // Se o estoque não suporta o consumo calculado, bloqueia a venda
          if (estoqueAtual < consumoTotal) {
            throw new Error(
              `Estoque insuficiente para o material "${materialDB.nome_material}".`
            );
          }

          // Registra o movimento que será usado para decrementar estoque depois
          movimentosEstoque.push({
            id_material,
            quantidade: consumoTotal,
          });
        }
      }

      // Cria a venda no banco com os dados calculados/normalizados
      // id_usuario vem do usuário autenticado (normalmente do token)
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

      // Para cada item preparado, cria um registro em ItemVenda
      // isso liga serviços à venda, com quantidade e valor unitário guardados no momento da venda
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

      // Aplica a baixa no estoque de materiais:
      // decrementa quant_estoque para cada material usado
      for (const mov of movimentosEstoque) {
        await Material.decrement("quant_estoque", {
          by: mov.quantidade,
          where: { id_material: mov.id_material },
          transaction: t,
        });
      }

      // Se todas as etapas ocorreram sem erro, confirma a transação
      await t.commit();

      console.log("DEBUG - venda registrada com sucesso:", venda.toJSON());
      return venda;
    } catch (err) {
      // Em qualquer erro, desfaz todas as alterações feitas dentro da transação
      await t.rollback();
      console.error("Erro ao registrar venda (service):", err);
      throw err;
    }
  },
};

export default VendaService;
