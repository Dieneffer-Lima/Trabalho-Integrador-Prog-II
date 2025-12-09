// frontend/src/pages/CaixaServicos.jsx

import React, { useEffect, useState } from "react";
import "../styles/caixaServicos.css";
import api from "../api";

function CaixaServicos({ irParaInicial, irParaCadastroNotaFiscal }) {
  const [dataVenda, setDataVenda] = useState("");
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);

  // seleção por serviço:
  // { [id_servico]: { selecionado, quantidadeServico, materiais: [{id_material, quantidade}] } }
  const [selecoesServicos, setSelecoesServicos] = useState({});

  const [tipoPagamento, setTipoPagamento] = useState("avista"); // 'avista' | 'prazo'
  const [metodoPagamento, setMetodoPagamento] = useState("debito"); // débito, crédito, pix, dinheiro

  const [mensagem, setMensagem] = useState(null); // { tipo: 'sucesso'|'erro', texto: string }
  const [carregando, setCarregando] = useState(false);

  // Carrega serviços e materiais do backend
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setMensagem(null);
        const [respServicos, respMateriais] = await Promise.all([
          api.get("/servicos"),
          api.get("/materiais"),
        ]);

        setServicosDisponiveis(respServicos.data || []);
        setMateriaisDisponiveis(respMateriais.data || []);
      } catch (err) {
        console.error("Erro ao carregar serviços/materiais:", err);
        setMensagem({
          tipo: "erro",
          texto: "Erro ao carregar serviços ou materiais. Verifique o backend.",
        });
      }
    };

    carregarDados();
  }, []);

  // --------- Handlers de seleção de serviços ----------

  const alternarServicoSelecionado = (idServico) => {
    setSelecoesServicos((prev) => {
      const atual = prev[idServico] || {
        selecionado: false,
        quantidadeServico: 1,
        materiais: [{ id_material: "", quantidade: 1 }],
      };

      return {
        ...prev,
        [idServico]: {
          ...atual,
          selecionado: !atual.selecionado,
        },
      };
    });
  };

  const alterarQuantidadeServico = (idServico, novaQtd) => {
    const qtdNum = parseInt(novaQtd, 10) || 1;
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

  // --------- Handlers de materiais por serviço ----------

  const adicionarLinhaMaterial = (idServico) => {
    setSelecoesServicos((prev) => {
      const atual = prev[idServico] || {
        selecionado: true,
        quantidadeServico: 1,
        materiais: [],
      };

      return {
        ...prev,
        [idServico]: {
          ...atual,
          materiais: [...atual.materiais, { id_material: "", quantidade: 1 }],
        },
      };
    });
  };

  const alterarMaterialServico = (idServico, index, campo, valor) => {
    setSelecoesServicos((prev) => {
      const atual = prev[idServico];
      if (!atual) return prev;

      const materiais = atual.materiais.map((mat, i) =>
        i === index
          ? {
              ...mat,
              [campo]:
                campo === "quantidade" ? parseInt(valor, 10) || 1 : valor,
            }
          : mat
      );

      return {
        ...prev,
        [idServico]: {
          ...atual,
          materiais,
        },
      };
    });
  };

  // --------- Envio da venda para o backend ----------

  const handleRealizarVenda = async (e) => {
    e.preventDefault();
    setMensagem(null);

    // Monta itens de serviço e materiais usados a partir das seleções
    const itens_servico = [];
    const materiais_utilizados = [];

    servicosDisponiveis.forEach((serv) => {
      const selecao = selecoesServicos[serv.id_servico];
      if (selecao?.selecionado && selecao.quantidadeServico > 0) {
        itens_servico.push({
          id_servico: serv.id_servico,
          quantidade: selecao.quantidadeServico,
        });

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

    if (itens_servico.length === 0) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione ao menos um serviço para realizar a venda.",
      });
      return;
    }

    setCarregando(true);

    // token do usuário logado
    const token = localStorage.getItem("token");

    if (!token) {
      setCarregando(false);
      setMensagem({
        tipo: "erro",
        texto: "Sessão expirada. Faça login novamente.",
      });
      return;
    }

    try {
      const hojeISO = new Date().toISOString().slice(0, 10);

      const payload = {
        data_venda: dataVenda || hojeISO, // 'YYYY-MM-DD'
        tipo_pagamento: tipoPagamento, // 'avista' | 'prazo'
        forma_pagamento:
          tipoPagamento === "avista" ? metodoPagamento || "debito" : null,
        itens_servico,
        materiais_utilizados,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const resp = await api.post("/venda", payload, config);
      console.log("Venda registrada:", resp.data);

      const vendaCriada = resp.data;

      // Salva a venda no localStorage, caso a tela de nota precise
      try {
        localStorage.setItem("ultimaVenda", JSON.stringify(vendaCriada));
      } catch (e) {
        console.error("Erro ao salvar ultimaVenda no localStorage:", e);
      }

      setMensagem({
        tipo: "sucesso",
        texto:
          tipoPagamento === "prazo"
            ? "Venda realizada com sucesso! Você será direcionado para o cadastro da nota fiscal."
            : "Venda realizada com sucesso!",
      });

      // Limpa seleção de serviços e materiais
      setSelecoesServicos({});
      setDataVenda("");
      setTipoPagamento("avista");
      setMetodoPagamento("debito");

      // Se for a prazo, abre tela de cadastro de notas fiscais
      if (
        tipoPagamento === "prazo" &&
        typeof irParaCadastroNotaFiscal === "function"
      ) {
        irParaCadastroNotaFiscal(vendaCriada.id_venda);
      }
    } catch (err) {
      console.error("Erro ao registrar venda:", err.response || err);
      setMensagem({
        tipo: "erro",
        texto:
          err.response?.data?.message ||
          "Erro ao registrar venda. Verifique o backend (/venda).",
      });
    } finally {
      setCarregando(false);
    }
  };

  // --------- Helpers simples ----------

  const obterSelecaoServico = (idServico) =>
    selecoesServicos[idServico] || {
      selecionado: false,
      quantidadeServico: 1,
      materiais: [{ id_material: "", quantidade: 1 }],
    };

  return (
    <div className="caixa-page">
      <div className="caixa-container">
        <header className="caixa-header">
          <h1 className="caixa-title">Gestão de Serviços</h1>

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

        {mensagem && (
          <div className={`caixa-mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleRealizarVenda}>
          <div className="caixa-grid">
            {/* BLOCO SERVIÇOS + QUANTIDADES */}
            <section className="caixa-servicos-card">
              <div className="caixa-servicos-header">
                <span>Serviços</span>
                <span>Quantidade</span>
              </div>

              <div className="caixa-servicos-lista">
                {servicosDisponiveis.length === 0 ? (
                  <p className="caixa-sem-registro">
                    Nenhum serviço cadastrado.
                  </p>
                ) : (
                  servicosDisponiveis.map((serv) => {
                    const selecao = obterSelecaoServico(serv.id_servico);

                    return (
                      <div
                        key={serv.id_servico}
                        className="caixa-servico-linha"
                      >
                        <div className="caixa-servico-esquerda">
                          <label className="caixa-servico-checkbox">
                            <input
                              type="checkbox"
                              checked={selecao.selecionado}
                              onChange={() =>
                                alternarServicoSelecionado(
                                  serv.id_servico
                                )
                              }
                            />
                            <span className="caixa-servico-nome">
                              {serv.nome_servico}
                            </span>
                          </label>

                          {selecao.selecionado && (
                            <div className="caixa-materiais-bloco">
                              <p className="caixa-materiais-titulo">
                                Materiais utilizados:
                              </p>

                              {selecao.materiais.map((mat, idx) => (
                                <div
                                  key={idx}
                                  className="caixa-materiais-row"
                                >
                                  <div className="caixa-mat-col">
                                    <span>Material:</span>
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

                              <button
                                type="button"
                                className="caixa-add-material"
                                onClick={() =>
                                  adicionarLinhaMaterial(
                                    serv.id_servico
                                  )
                                }
                              >
                                + Adicionar outro material
                              </button>
                            </div>
                          )}
                        </div>

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

            {/* BLOCO FORMA DE PAGAMENTO */}
            <section className="caixa-pagamento-card">
              <h2 className="caixa-pagamento-title">
                Forma de Pagamento:
              </h2>

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

              {tipoPagamento === "prazo" && (
                <p className="caixa-info-prazo">
                  Ao finalizar a venda a prazo, você será direcionado
                  para o cadastro de notas fiscais.
                </p>
              )}
            </section>
          </div>

          <div className="caixa-botoes">
            <button
              type="submit"
              className="btn-realizar-venda"
              disabled={carregando}
            >
              {carregando ? "Registrando..." : "Realizar venda"}
            </button>

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

export default CaixaServicos;

