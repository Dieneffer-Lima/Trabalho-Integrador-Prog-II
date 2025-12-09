// frontend/src/pages/CadastroNotaFiscal.jsx

import React, { useEffect, useState } from "react";
import "../styles/notasFiscais.css";
import api from "../api";

function CadastroNotaFiscal({ irParaInicial, vendaId }) {
  const [idVenda, setIdVenda] = useState(vendaId || null);
  const [numeroNota, setNumeroNota] = useState("");
  const [dataEmissao, setDataEmissao] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [statusPagamento, setStatusPagamento] = useState("pendente");

  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Ao montar, tenta recuperar venda do localStorage se prop não vier
  useEffect(() => {
    if (!idVenda) {
      try {
        const ultimaVendaJSON = localStorage.getItem("ultimaVenda");
        if (ultimaVendaJSON) {
          const ultimaVenda = JSON.parse(ultimaVendaJSON);
          if (ultimaVenda && ultimaVenda.id_venda) {
            setIdVenda(ultimaVenda.id_venda);
            if (ultimaVenda.total_venda) {
              setValorTotal(String(ultimaVenda.total_venda).replace(".", ","));
            }
          }
        }
      } catch (e) {
        console.error("Erro ao ler ultimaVenda do localStorage:", e);
      }
    }
  }, [idVenda]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (!idVenda) {
      setMensagem({
        tipo: "erro",
        texto:
          "ID da venda não encontrado. Volte ao caixa, finalize uma venda a prazo e tente novamente.",
      });
      return;
    }

    if (!numeroNota || !valorTotal) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha, no mínimo, Número da Nota e Valor Total.",
      });
      return;
    }

    setCarregando(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCarregando(false);
        setMensagem({
          tipo: "erro",
          texto: "Sessão expirada. Faça login novamente.",
        });
        return;
      }

      const payload = {
        id_venda: idVenda,
        numero_nota: numeroNota,
        data_emissao: dataEmissao || null,
        valor_total: parseFloat(valorTotal.replace(",", ".")),
        status_pagamento: statusPagamento, // 'pendente' ou 'pago'
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const resp = await api.post("/notas-fiscais", payload, config);
      console.log("Nota fiscal criada:", resp.data);

      setMensagem({
        tipo: "sucesso",
        texto: "Nota fiscal cadastrada com sucesso!",
      });

      setNumeroNota("");
      setDataEmissao("");
      setValorTotal("");
      setStatusPagamento("pendente");
    } catch (err) {
      console.error("Erro ao cadastrar nota:", err.response || err);
      setMensagem({
        tipo: "erro",
        texto:
          err.response?.data?.message ||
          "Erro ao cadastrar nota fiscal. Verifique o backend (/notas-fiscais).",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="nota-page">
      <main className="nota-container">
        <header className="nota-header">
          <h1 className="nota-title">Cadastro de Nota Fiscal</h1>
        </header>

        {mensagem && (
          <div className={`nota-mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form className="nota-form" onSubmit={handleSubmit}>
          <div className="nota-row">
            <label className="nota-label">
              ID da Venda:
              <input
                type="text"
                className="nota-input"
                value={idVenda || ""}
                readOnly
              />
            </label>

            <label className="nota-label">
              Número da Nota:
              <input
                type="text"
                className="nota-input"
                value={numeroNota}
                onChange={(e) => setNumeroNota(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="nota-row">
            <label className="nota-label">
              Data de Emissão:
              <input
                type="date"
                className="nota-input"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
              />
            </label>

            <label className="nota-label">
              Valor Total (R$):
              <input
                type="text"
                className="nota-input"
                placeholder="0,00"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="nota-row">
            <label className="nota-label">
              Status do Pagamento:
              <select
                className="nota-input"
                value={statusPagamento}
                onChange={(e) => setStatusPagamento(e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </label>
          </div>

          <div className="nota-botoes">
            <button
              type="submit"
              className="nota-salvar"
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar Nota"}
            </button>

            <button
              type="button"
              className="nota-voltar"
              onClick={irParaInicial}
            >
              Voltar à Tela Inicial
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CadastroNotaFiscal;
