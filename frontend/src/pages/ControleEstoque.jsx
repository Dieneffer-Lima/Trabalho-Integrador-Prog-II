// frontend/src/pages/ControleEstoque.jsx

// Importa o React e hooks para estado e efeito de carregamento ao montar a tela
import React, { useState, useEffect } from "react";
// Importa o CSS da tela de controle de estoque
import "../styles/controleEstoque.css";
// Importa a instância do axios configurada para chamadas ao backend
import api from "../api";

// Componente que exibe materiais em tabela e permite ir para a tela de entrada de estoque
function ControleEstoque({
  irParaInicial,
  irParaEntradaEstoque,
  handleLogout,
}) {
  // Lista de produtos/materiais exibidos na tabela
  const [produtos, setProdutos] = useState([]);
  // Controla estado de carregamento da tela ao buscar dados do backend
  const [carregando, setCarregando] = useState(true);
  // Mensagem de feedback (erro/sucesso) exibida acima da tabela
  const [mensagem, setMensagem] = useState(null);

  // Ao abrir a tela, busca a lista de materiais do backend
  useEffect(() => {
    const buscarMateriais = async () => {
      try {
        // Ativa carregamento e limpa mensagens anteriores
        setCarregando(true);
        setMensagem(null);

        // Requisição GET para listar materiais do backend
        const response = await api.get("/materiais");

        // Converte o retorno da API para a estrutura usada pela tabela
        const lista = response.data.map((item) => ({
          id: item.id_material,
          nome: item.nome_material,
          quantidade: item.quant_estoque,
          valor: item.valor_material,
        }));

        // Atualiza o estado da tabela com a lista carregada
        setProdutos(lista);
      } catch (err) {
        // Registra no console para debug
        console.error("Erro ao carregar materiais:", err);
        // Mensagem amigável para o usuário
        setMensagem({
          tipo: "erro",
          texto:
            "Erro ao carregar materiais do estoque. Verifique o backend /materiais.",
        });
      } finally {
        // Finaliza carregamento
        setCarregando(false);
      }
    };

    // Executa a consulta ao montar o componente
    buscarMateriais();
  }, []);

  // Renderização da página de controle de estoque
  return (
    <div className="estoque-page">
      {/* Cabeçalho com título e botões de navegação */}
      <header className="estoque-header">
        <h1 className="estoque-title">Controle de Estoque</h1>

        {/* Volta para a área administrativa */}
        <button className="estoque-voltar" onClick={irParaInicial}>
          Voltar
        </button>

        {/* Faz logout (limpa sessão) e volta para Login */}
        <button className="estoque-sair" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* Exibe mensagem de feedback (erro/sucesso) */}
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

      {/* Botão que leva para a tela de EntradaEstoque */}
      <div className="estoque-actions">
        <button
          className="botao-adicionar"
          type="button"
          onClick={irParaEntradaEstoque}
        >
          Adicionar Produto
        </button>
      </div>

      {/* Área da tabela */}
      <div className="estoque-table-container">
        {/* Se estiver carregando, mostra texto; caso contrário, renderiza tabela */}
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
              {/* Se não houver produtos, mostra uma linha informando */}
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan="3">Nenhum produto cadastrado.</td>
                </tr>
              ) : (
                // Renderiza uma linha por produto/material retornado do backend
                produtos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>
                      R$
                      {Number(p.valor)
                        .toFixed(2)
                        // Formata moeda para padrão brasileiro usando vírgula
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

// Exporta o componente para ser usado no App.jsx
export default ControleEstoque;
