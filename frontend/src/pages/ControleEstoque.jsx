// frontend/src/pages/ControleEstoque.jsx

import React, { useState, useEffect } from "react";
import "../styles/controleEstoque.css";
import api from "../api"; // mesma instância usada em EntradaEstoque.jsx

function ControleEstoque({
  irParaInicial,
  irParaEntradaEstoque,
  handleLogout,
}) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);

  // 🔄 Carrega materiais do backend ao abrir a tela
  useEffect(() => {
    const buscarMateriais = async () => {
      try {
        setCarregando(true);
        setMensagem(null);

        // mesmo endpoint que você usa no select da EntradaEstoque
        const response = await api.get("/materiais");

        // Aqui uso diretamente os campos do backend
        const lista = response.data.map((item) => ({
          id: item.id_material,
          nome: item.nome_material,
          quantidade: item.quant_estoque,
          valor: item.valor_material,
        }));

        setProdutos(lista);
      } catch (err) {
        console.error("Erro ao carregar materiais:", err);
        setMensagem({
          tipo: "erro",
          texto:
            "Erro ao carregar materiais do estoque. Verifique o backend /materiais.",
        });
      } finally {
        setCarregando(false);
      }
    };

    buscarMateriais();
  }, []);

  return (
    <div className="estoque-page">
      {/* Cabeçalho */}
      <header className="estoque-header">
        <h1 className="estoque-title">Controle de Estoque</h1>

        <button className="estoque-voltar" onClick={irParaInicial}>
          Voltar
        </button>

        <button className="estoque-sair" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* Mensagem (erro/sucesso) */}
      {mensagem && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor:
              mensagem.tipo === "erro" ? "#ffdddd" : "#ddffdd",
            color: mensagem.tipo === "erro" ? "#a10000" : "#005500",
          }}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Botão Adicionar Produto → ENTRADA DE ESTOQUE */}
      <div className="estoque-actions">
        <button
          className="botao-adicionar"
          type="button"
          onClick={irParaEntradaEstoque}
        >
          Adicionar Produto
        </button>
      </div>

      {/* Tabela */}
      <div className="estoque-table-container">
        {carregando ? (
          <p>Carregando materiais do estoque...</p>
        ) : (
          <table className="estoque-tabela">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantidade em Estoque</th>
                <th>Valor Unitário</th>
              </tr>
            </thead>

            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan="3">Nenhum produto cadastrado.</td>
                </tr>
              ) : (
                produtos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>
                      R$
                      {Number(p.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ControleEstoque;
