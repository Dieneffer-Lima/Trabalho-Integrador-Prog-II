// frontend/src/pages/CadastroServicos.jsx

import React, { useState, useEffect } from "react";
import "../styles/cadastroServicos.css";
import api from "../api";

function CadastroServicos({ irParaInicial }) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [servicos, setServicos] = useState([]);

  // Carrega serviços já cadastrados
  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const resp = await api.get("/servicos");
        const lista = resp.data.map((item) => ({
          id: item.id_servico,
          nome: item.nome_servico,
          valor: item.valor_servico,
        }));

        setServicos(lista);
      } catch (err) {
        console.error(err);
        setMensagem({ tipo: "erro", texto: "Erro ao carregar serviços." });
      }
    };

    carregarServicos();
  }, []);

  // SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();
  setMensagem(null);

  if (!nome || !valor) {
    setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
    return;
  }

  setCarregando(true);

  try {
    const payload = {
      nome_servico: nome,
      valor_servico: parseFloat(valor.replace(",", ".")),
    };

    const resp = await api.post("/servicos", payload);

    setMensagem({
      tipo: "sucesso",
      texto: `Serviço "${nome}" cadastrado com sucesso!`,
    });

    setNome("");
    setValor("");

    // resp.data deve ser o objeto criado
    setServicos((prev) => [...prev, resp.data]);
  } catch (err) {
    console.error("ERRO NO POST /servicos:", err.response?.data || err);

    setMensagem({
      tipo: "erro",
      texto:
        err.response?.data?.message ||
        "Erro ao cadastrar serviço (ver console do navegador).",
    });
  } finally {
    setCarregando(false);
  }
};


  return (
    <div className="cadastro-servicos-page">
      <main className="main-content-servicos">
        <header className="servicos-header">
          <h1 className="servicos-title">Cadastro de Serviços</h1>
        </header>

        {mensagem && (
          <div
            className={`mensagem ${mensagem.tipo}`}
            style={{ marginBottom: "15px" }}
          >
            {mensagem.texto}
          </div>
        )}

        <form className="servicos-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="servicos-label">
              Nome do Serviço:
              <input
                type="text"
                className="servicos-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>

            <label className="servicos-label">
              Valor (R$):
              <input
                type="text"
                className="servicos-input"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="salvar-container">
            <button type="submit" className="salvar-button" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          <div className="tabela-container">
            <table className="servicos-tabela">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nome_servico || s.nome}</td>
                    <td>
                      R$
                      {Number(s.valor_servico || s.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  </tr>
                ))}
                {servicos.length === 0 && (
                  <tr>
                    <td colSpan="2">Nenhum serviço cadastrado.</td>
                  </tr>
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

export default CadastroServicos;
