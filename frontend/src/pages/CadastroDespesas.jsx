// frontend/src/pages/CadastroDespesas.jsx

import React, { useEffect, useState } from "react";
import "../styles/cadastroDespesas.css";
import api from "../api";

function CadastroDespesas({ irParaInicial }) {
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataDespesa, setDataDespesa] = useState("");

  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [despesas, setDespesas] = useState([]);

  // Carrega despesas existentes
  useEffect(() => {
    const carregarDespesas = async () => {
      try {
        const resp = await api.get("/despesas");
        const lista = resp.data.map((item) => ({
          id: item.id_despesa,
          categoria: item.categoria,
          descricao: item.descricao_despesa,
          valor: Number(item.valor_despesa), // 🔹 garante número
          data: item.data_despesa,
        }));
        setDespesas(lista);
      } catch (err) {
        console.error("Erro ao carregar despesas:", err);
        setMensagem({
          tipo: "erro",
          texto: "Erro ao carregar despesas.",
        });
      }
    };

    carregarDespesas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (!categoria || !valor) {
      setMensagem({
        tipo: "erro",
        texto: "Preencha ao menos Categoria e Valor.",
      });
      return;
    }

    setCarregando(true);

    try {
      const payload = {
        categoria,
        descricao_despesa: descricao || null,
        valor_despesa: parseFloat(valor.replace(",", ".")),
        data_despesa: dataDespesa || null, // se vazio, backend pode assumir data atual
      };

      const resp = await api.post("/despesas", payload);
      const nova = resp.data;

      setMensagem({
        tipo: "sucesso",
        texto: `Despesa "${categoria}" cadastrada com sucesso!`,
      });

      // limpa inputs
      setCategoria("");
      setDescricao("");
      setValor("");
      setDataDespesa("");

      // adiciona na tabela já no formato esperado
      const despesaNormalizada = {
        id: nova.id_despesa,
        categoria: nova.categoria,
        descricao: nova.descricao_despesa,
        valor: Number(nova.valor_despesa),
        data: nova.data_despesa,
      };

      setDespesas((prev) => [...prev, despesaNormalizada]);
    } catch (err) {
      console.error("Erro ao cadastrar despesa:", err.response || err);
      setMensagem({
        tipo: "erro",
        texto:
          err.response?.data?.message ||
          "Erro ao cadastrar despesa. Verifique o backend.",
      });
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    // espera YYYY-MM-DD
    const [ano, mes, dia] = dataStr.split("-");
    if (!dia) return dataStr;
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="cadastro-despesas-page">
      <main className="main-content-despesas">
        <header className="despesas-header">
          <h1 className="despesas-title">Cadastro de Despesas</h1>
        </header>

        {mensagem && (
          <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <form className="despesas-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="despesas-label">
              Categoria:
              <input
                type="text"
                className="despesas-input"
                placeholder="Ex.: Salário, Água, Luz, Internet, Materiais..."
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              />
            </label>

            <label className="despesas-label">
              Valor (R$):
              <input
                type="text"
                className="despesas-input"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="despesas-label">
              Data da Despesa:
              <input
                type="date"
                className="despesas-input"
                value={dataDespesa}
                onChange={(e) => setDataDespesa(e.target.value)}
              />
            </label>

            <label className="despesas-label descricao-full">
              Descrição (opcional):
              <input
                type="text"
                className="despesas-input"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </label>
          </div>

          <div className="salvar-container">
            <button
              type="submit"
              className="salvar-button"
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          <div className="tabela-container">
            <table className="despesas-tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {despesas.length === 0 ? (
                  <tr>
                    <td colSpan="4">Nenhuma despesa cadastrada.</td>
                  </tr>
                ) : (
                  despesas.map((d) => (
                    <tr key={d.id}>
                      <td>{formatarData(d.data)}</td>
                      <td>{d.categoria}</td>
                      <td>{d.descricao}</td>
                      <td>
                        R$
                        {Number(d.valor)
                          .toFixed(2)
                          .replace(".", ",")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </form>

        <button className="voltar-button" onClick={irParaInicial}>
          Voltar
        </button>
      </main>
    </div>
  );
}

export default CadastroDespesas;
