import React, { useEffect, useState } from "react"; // Hooks: estado e efeito de carregamento inicial
import "../styles/cadastroDespesas.css"; // CSS da página
import api from "../api"; // axios configurado (baseURL, interceptors, etc, se houver)

function CadastroDespesas({ irParaInicial }) {
  // Campos do formulário
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataDespesa, setDataDespesa] = useState("");

  // Controle de UI
  const [mensagem, setMensagem] = useState(null); // { tipo, texto }
  const [carregando, setCarregando] = useState(false);

  // Lista exibida na tabela
  const [despesas, setDespesas] = useState([]);

  // Ao abrir a tela, busca despesas existentes no backend
  useEffect(() => {
    const carregarDespesas = async () => {
      try {
        // GET /despesas para trazer dados do banco
        const resp = await api.get("/despesas");

        // Normaliza os dados para o formato usado na tabela
        const lista = resp.data.map((item) => ({
          id: item.id_despesa,
          categoria: item.categoria,
          descricao: item.descricao_despesa,
          valor: Number(item.valor_despesa),
          data: item.data_despesa,
        }));

        setDespesas(lista);
      } catch (err) {
        console.error("Erro ao carregar despesas:", err);
        setMensagem({ tipo: "erro", texto: "Erro ao carregar despesas." });
      }
    };

    carregarDespesas();
  }, []);

  // Envia o formulário para cadastrar uma nova despesa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    // Validação mínima
    if (!categoria || !valor) {
      setMensagem({ tipo: "erro", texto: "Preencha ao menos Categoria e Valor." });
      return;
    }

    setCarregando(true);

    try {
      // Monta payload conforme o backend espera
      const payload = {
        categoria,
        descricao_despesa: descricao || null,
        valor_despesa: parseFloat(valor.replace(",", ".")),
        data_despesa: dataDespesa || null,
      };

      // POST /despesas para salvar no banco
      const resp = await api.post("/despesas", payload);

      // Objeto retornado do backend (despesa criada)
      const nova = resp.data;

      setMensagem({
        tipo: "sucesso",
        texto: `Despesa "${categoria}" cadastrada com sucesso!`,
      });

      // Limpa o formulário
      setCategoria("");
      setDescricao("");
      setValor("");
      setDataDespesa("");

      // Normaliza e adiciona a nova despesa na tabela sem precisar refazer o GET
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

  // Função utilitária para mostrar data em formato DD/MM/AAAA
  const formatarData = (dataStr) => {
    if (!dataStr) return "";
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

        {/* Mensagem de erro/sucesso */}
        {mensagem && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}

        {/* Formulário de cadastro */}
        <form className="despesas-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="despesas-label">
              Categoria:
              <input
                type="text"
                className="despesas-input"
                placeholder="Ex.: Salário, Água, Luz, Internet..."
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
            <button type="submit" className="salvar-button" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {/* Tabela de despesas */}
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
                        {Number(d.valor).toFixed(2).replace(".", ",")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </form>

        {/* Volta para a tela inicial */}
        <button className="voltar-button" onClick={irParaInicial}>
          Voltar
        </button>
      </main>
    </div>
  );
}

export default CadastroDespesas;
