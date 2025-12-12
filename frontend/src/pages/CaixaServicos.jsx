// frontend/src/pages/CaixaServicos.jsx

// Importa React e hooks para controlar estados e carregar dados ao abrir a tela
import React, { useEffect, useState } from "react";
// Importa CSS específico da tela do caixa
import "../styles/caixaServicos.css";
// Importa instância configurada do axios para consumo do backend
import api from "../api";

// Componente responsável por registrar vendas de serviços e materiais usados
// Recebe funções de navegação: voltar para inicial e ir para cadastro de nota fiscal
function CaixaServicos({ irParaInicial, irParaCadastroNotaFiscal }) {
  // Data da venda selecionada no input type="date"
  const [dataVenda, setDataVenda] = useState("");

  // Lista de serviços retornados pelo backend (/servicos)
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  // Lista de materiais retornados pelo backend (/materiais)
  const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);

  // Estrutura que guarda seleção e quantidades por serviço
  // Exemplo:
  // selecoesServicos[id_servico] = {
  //   selecionado: true/false,
  //   quantidadeServico: number,
  //   materiais: [{ id_material: "", quantidade: number }]
  // }
  const [selecoesServicos, setSelecoesServicos] = useState({});

  // Controla se a venda é à vista ou a prazo
  const [tipoPagamento, setTipoPagamento] = useState("avista");
  // Método de pagamento para vendas à vista (débito/crédito/pix/dinheiro)
  const [metodoPagamento, setMetodoPagamento] = useState("debito");

  // Mensagem de feedback para o usuário (sucesso/erro)
  const [mensagem, setMensagem] = useState(null);
  // Controla estado de carregamento durante o envio da venda
  const [carregando, setCarregando] = useState(false);

  // Ao abrir a tela, carrega lista de serviços e materiais do backend
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Limpa mensagens anteriores antes de carregar dados
        setMensagem(null);

        // Faz duas requisições em paralelo para melhorar desempenho
        const [respServicos, respMateriais] = await Promise.all([
          api.get("/servicos"),
          api.get("/materiais"),
        ]);

        // Salva dados retornados no estado para renderização
        setServicosDisponiveis(respServicos.data || []);
        setMateriaisDisponiveis(respMateriais.data || []);
      } catch (err) {
        // Se falhar, registra erro para debug e mostra mensagem ao usuário
        console.error("Erro ao carregar serviços/materiais:", err);
        setMensagem({
          tipo: "erro",
          texto: "Erro ao carregar serviços ou materiais. Verifique o backend.",
        });
      }
    };

    carregarDados();
  }, []);

  // Alterna um serviço entre selecionado e não selecionado no checkbox
  const alternarServicoSelecionado = (idServico) => {
    setSelecoesServicos((prev) => {
      // Se não existir seleção ainda para esse serviço, cria uma estrutura padrão
      const atual = prev[idServico] || {
        selecionado: false,
        quantidadeServico: 1,
        materiais: [{ id_material: "", quantidade: 1 }],
      };

      // Retorna o novo objeto de seleções, invertendo o status "selecionado"
      return {
        ...prev,
        [idServico]: {
          ...atual,
          selecionado: !atual.selecionado,
        },
      };
    });
  };

  // Atualiza quantidade do serviço selecionado (quantas vezes aquele serviço foi realizado)
  const alterarQuantidadeServico = (idServico, novaQtd) => {
    // Converte o valor do select para número e garante pelo menos 1
    const qtdNum = parseInt(novaQtd, 10) || 1;

    // Atualiza o estado, mantendo os outros serviços inalterados
    setSelecoesServicos((prev) => ({
      ...prev,
      [idServico]: {
        ...(prev[idServico] || {
          selecionado: true,
          materiais: [{ id_material: "", quantidade: 1 }],
        }),
        quantidadeServico: qtdNum,
      },
    }));
  };

  // Adiciona uma nova linha de material dentro de um serviço selecionado
  const adicionarLinhaMaterial = (idServico) => {
    setSelecoesServicos((prev) => {
      // Garante que existe um objeto de seleção para esse serviço
      const atual = prev[idServico] || {
        selecionado: true,
        quantidadeServico: 1,
        materiais: [],
      };

      // Adiciona um novo material vazio (usuário vai escolher no select)
      return {
        ...prev,
        [idServico]: {
          ...atual,
          materiais: [...atual.materiais, { id_material: "", quantidade: 1 }],
        },
      };
    });
  };

  // Atualiza um campo (id_material ou quantidade) de um material específico dentro de um serviço
  const alterarMaterialServico = (idServico, index, campo, valor) => {
    setSelecoesServicos((prev) => {
      const atual = prev[idServico];
      // Se não houver seleção para o serviço, não altera nada
      if (!atual) return prev;

      // Atualiza apenas o item no índice indicado
      const materiais = atual.materiais.map((mat, i) =>
        i === index
          ? {
              ...mat,
              // Se o campo for quantidade, converte para número e garante pelo menos 1
              [campo]:
                campo === "quantidade" ? parseInt(valor, 10) || 1 : valor,
            }
          : mat
      );

      // Retorna o estado atualizado para aquele serviço
      return {
        ...prev,
        [idServico]: {
          ...atual,
          materiais,
        },
      };
    });
  };

  // Envia os dados da venda para o backend
  const handleRealizarVenda = async (e) => {
    // Evita reload da página
    e.preventDefault();

    // Limpa mensagens anteriores
    setMensagem(null);

    // Lista de serviços que irão compor a venda
    const itens_servico = [];
    // Lista de materiais consumidos por serviço (para controle de estoque)
    const materiais_utilizados = [];

    // Percorre os serviços disponíveis para montar o payload com base no estado selecoesServicos
    servicosDisponiveis.forEach((serv) => {
      const selecao = selecoesServicos[serv.id_servico];

      // Só inclui no payload se estiver selecionado e com quantidade válida
      if (selecao?.selecionado && selecao.quantidadeServico > 0) {
        itens_servico.push({
          id_servico: serv.id_servico,
          quantidade: selecao.quantidadeServico,
        });

        // Para cada material selecionado nesse serviço, adiciona na lista de materiais utilizados
        (selecao.materiais || []).forEach((m) => {
          if (m.id_material && m.quantidade > 0) {
            materiais_utilizados.push({
              id_servico: serv.id_servico,
              id_material: Number(m.id_material),
              quantidade: Number(m.quantidade),
            });
          }
        });
      }
    });

    // Validação: não permite registrar venda sem pelo menos 1 serviço
    if (itens_servico.length === 0) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione ao menos um serviço para realizar a venda.",
      });
      return;
    }

    // Ativa carregamento durante a requisição
    setCarregando(true);

    // Recupera token salvo no login para autorizar a chamada no backend
    const token = localStorage.getItem("token");

    // Se não houver token, a sessão expirou ou o usuário não está logado
    if (!token) {
      setCarregando(false);
      setMensagem({
        tipo: "erro",
        texto: "Sessão expirada. Faça login novamente.",
      });
      return;
    }

    try {
      // Data padrão: hoje no formato 'YYYY-MM-DD'
      const hojeISO = new Date().toISOString().slice(0, 10);

      // Monta o payload completo da venda conforme o backend espera
      const payload = {
        data_venda: dataVenda || hojeISO,
        tipo_pagamento: tipoPagamento,
        // Forma de pagamento só faz sentido quando a venda é à vista
        forma_pagamento:
          tipoPagamento === "avista" ? metodoPagamento || "debito" : null,
        itens_servico,
        materiais_utilizados,
      };

      // Configuração com header Authorization para rotas protegidas por JWT
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Envia a venda para o backend (rota responsável por salvar venda e itens no banco)
      const resp = await api.post("/venda", payload, config);
      console.log("Venda registrada:", resp.data);

      // Objeto de venda retornado pelo backend (deve conter id_venda, totais, etc.)
      const vendaCriada = resp.data;

      // Salva a última venda no localStorage para reutilizar na tela de nota fiscal
      try {
        localStorage.setItem("ultimaVenda", JSON.stringify(vendaCriada));
      } catch (e) {
        console.error("Erro ao salvar ultimaVenda no localStorage:", e);
      }

      // Mensagem de sucesso varia conforme o tipo de pagamento
      setMensagem({
        tipo: "sucesso",
        texto:
          tipoPagamento === "prazo"
            ? "Venda realizada com sucesso! Você será direcionado para o cadastro da nota fiscal."
            : "Venda realizada com sucesso!",
      });

      // Limpa estados do formulário para iniciar uma nova venda
      setSelecoesServicos({});
      setDataVenda("");
      setTipoPagamento("avista");
      setMetodoPagamento("debito");

      // Se venda for a prazo, chama a navegação para a tela de cadastro de nota fiscal
      if (
        tipoPagamento === "prazo" &&
        typeof irParaCadastroNotaFiscal === "function"
      ) {
        irParaCadastroNotaFiscal(vendaCriada.id_venda);
      }
    } catch (err) {
      // Se o backend retornar erro, registra no console e mostra mensagem ao usuário
      console.error("Erro ao registrar venda:", err.response || err);
      setMensagem({
        tipo: "erro",
        texto:
          err.response?.data?.message ||
          "Erro ao registrar venda. Verifique o backend (/venda).",
      });
    } finally {
      // Desativa carregamento ao final da operação
      setCarregando(false);
    }
  };

  // Função auxiliar que garante um objeto padrão de seleção para um serviço
  const obterSelecaoServico = (idServico) =>
    selecoesServicos[idServico] || {
      selecionado: false,
      quantidadeServico: 1,
      materiais: [{ id_material: "", quantidade: 1 }],
    };

  // Renderização da tela do caixa
  return (
    <div className="caixa-page">
      <div className="caixa-container">
        <header className="caixa-header">
          <h1 className="caixa-title">Gestão de Serviços</h1>

          {/* Campo para o usuário escolher a data da venda */}
          <div className="caixa-data">
            <label>
              Data:
              <input
                type="date"
                value={dataVenda}
                onChange={(e) => setDataVenda(e.target.value)}
              />
            </label>
          </div>
        </header>

        {/* Exibe mensagem de sucesso/erro */}
        {mensagem && (
          <div className={`caixa-mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* Formulário que, ao enviar, chama handleRealizarVenda */}
        <form onSubmit={handleRealizarVenda}>
          <div className="caixa-grid">
            {/* Seção de seleção de serviços e materiais */}
            <section className="caixa-servicos-card">
              <div className="caixa-servicos-header">
                <span>Serviços</span>
                <span>Quantidade</span>
              </div>

              <div className="caixa-servicos-lista">
                {/* Se não há serviços cadastrados, mostra aviso */}
                {servicosDisponiveis.length === 0 ? (
                  <p className="caixa-sem-registro">
                    Nenhum serviço cadastrado.
                  </p>
                ) : (
                  // Renderiza uma linha para cada serviço retornado do backend
                  servicosDisponiveis.map((serv) => {
                    // Recupera o estado de seleção daquele serviço
                    const selecao = obterSelecaoServico(serv.id_servico);

                    return (
                      <div
                        key={serv.id_servico}
                        className="caixa-servico-linha"
                      >
                        <div className="caixa-servico-esquerda">
                          {/* Checkbox de seleção do serviço */}
                          <label className="caixa-servico-checkbox">
                            <input
                              type="checkbox"
                              checked={selecao.selecionado}
                              // Ao marcar/desmarcar, altera o estado do serviço selecionado
                              onChange={() =>
                                alternarServicoSelecionado(serv.id_servico)
                              }
                            />
                            <span className="caixa-servico-nome">
                              {serv.nome_servico}
                            </span>
                          </label>

                          {/* Só mostra o bloco de materiais se o serviço estiver selecionado */}
                          {selecao.selecionado && (
                            <div className="caixa-materiais-bloco">
                              <p className="caixa-materiais-titulo">
                                Materiais utilizados:
                              </p>

                              {/* Renderiza cada linha de material relacionada a esse serviço */}
                              {selecao.materiais.map((mat, idx) => (
                                <div
                                  key={idx}
                                  className="caixa-materiais-row"
                                >
                                  <div className="caixa-mat-col">
                                    <span>Material:</span>

                                    {/* Select para escolher material consumido */}
                                    <select
                                      value={mat.id_material}
                                      onChange={(e) =>
                                        alterarMaterialServico(
                                          serv.id_servico,
                                          idx,
                                          "id_material",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Selecione um material
                                      </option>

                                      {/* Lista de materiais disponíveis vinda do backend */}
                                      {materiaisDisponiveis.map((m) => (
                                        <option
                                          key={m.id_material}
                                          value={m.id_material}
                                        >
                                          {m.nome_material}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="caixa-mat-col">
                                    <span>Quantidade:</span>

                                    {/* Input da quantidade consumida do material */}
                                    <input
                                      type="number"
                                      min="1"
                                      value={mat.quantidade}
                                      onChange={(e) =>
                                        alterarMaterialServico(
                                          serv.id_servico,
                                          idx,
                                          "quantidade",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}

                              {/* Adiciona mais uma linha de material para esse serviço */}
                              <button
                                type="button"
                                className="caixa-add-material"
                                onClick={() =>
                                  adicionarLinhaMaterial(serv.id_servico)
                                }
                              >
                                + Adicionar outro material
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Select de quantidade de vezes que o serviço será lançado */}
                        <div className="caixa-servico-direita">
                          <select
                            value={selecao.quantidadeServico}
                            onChange={(e) =>
                              alterarQuantidadeServico(
                                serv.id_servico,
                                e.target.value
                              )
                            }
                          >
                            {/* Gera opções de 1 a 10 */}
                            {Array.from({ length: 10 }).map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Seção de escolha de forma de pagamento */}
            <section className="caixa-pagamento-card">
              <h2 className="caixa-pagamento-title">
                Forma de Pagamento:
              </h2>

              {/* Radio para escolher entre à vista e a prazo */}
              <div className="caixa-radio-group">
                <label className="caixa-radio-option">
                  <input
                    type="radio"
                    name="tipoPagamento"
                    value="avista"
                    checked={tipoPagamento === "avista"}
                    onChange={() => setTipoPagamento("avista")}
                  />
                  <span>À vista</span>
                </label>

                <label className="caixa-radio-option">
                  <input
                    type="radio"
                    name="tipoPagamento"
                    value="prazo"
                    checked={tipoPagamento === "prazo"}
                    onChange={() => setTipoPagamento("prazo")}
                  />
                  <span>À prazo</span>
                </label>
              </div>

              {/* Se for à vista, mostra select do método de pagamento */}
              {tipoPagamento === "avista" && (
                <div className="caixa-metodo-pagamento">
                  <span>Método:</span>
                  <select
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                  >
                    <option value="debito">Débito</option>
                    <option value="credito">Crédito</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>
              )}

              {/* Se for a prazo, mostra uma informação para o usuário */}
              {tipoPagamento === "prazo" && (
                <p className="caixa-info-prazo">
                  Ao finalizar a venda a prazo, você será direcionado
                  para o cadastro de notas fiscais.
                </p>
              )}
            </section>
          </div>

          {/* Botões principais do formulário */}
          <div className="caixa-botoes">
            {/* Botão de submit que chama handleRealizarVenda */}
            <button
              type="submit"
              className="btn-realizar-venda"
              disabled={carregando}
            >
              {carregando ? "Registrando..." : "Realizar venda"}
            </button>

            {/* Botão de voltar para área administrativa */}
            <button
              type="button"
              className="btn-voltar"
              onClick={irParaInicial}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Exporta o componente para ser usado no App.jsx
export default CaixaServicos;
