import React, { useState } from "react"; // React e estado local para controlar inputs e lista
import axios from "axios"; // Cliente HTTP para consumir a API do backend
import "../styles/cadastroMateriais.css"; // CSS da página

// URL base do backend (rotas começam com /api)
const API_URL = "http://localhost:3001/api";

function CadastroMateriais({ irParaInicial }) {
  // Estados dos campos do formulário
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  // Estados de controle da interface (loading e mensagens)
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success"); // "success" | "error"

  // Lista de materiais que aparece na tabela (atualizada quando cadastra)
  const [materiaisExistentes, setMateriaisExistentes] = useState([]);

  // Envio do formulário: cria material no backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita reload da página
    setMensagem(""); // limpa mensagem anterior
    setCarregando(true); // ativa loading

    // Validação básica no frontend
    if (!nome || !quantidade || !valor) {
      setTipoMensagem("error");
      setMensagem("Por favor, preencha Nome, Quantidade e Valor.");
      setCarregando(false);
      return;
    }

    try {
      // Token salvo no login para rotas protegidas
      const token = localStorage.getItem("token");

      // Objeto com nomes iguais aos campos do model Sequelize no backend
      const novoMaterial = {
        nome_material: nome,
        quant_estoque: parseInt(quantidade),
        valor_material: parseFloat(valor.replace(",", ".")),
        descricao_material: descricao || null,
      };

      // POST /api/materiais para cadastrar no banco
      const resp = await axios.post(`${API_URL}/materiais`, novoMaterial, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Quando o backend cria, retorna 201 e o objeto criado
      if (resp.status === 201) {
        setTipoMensagem("success");
        setMensagem(`Material "${nome}" cadastrado com sucesso!`);

        // Limpa campos do formulário
        setNome("");
        setQuantidade("");
        setValor("");
        setDescricao("");

        // Atualiza a tabela local adicionando o material retornado pelo backend
        setMateriaisExistentes((prev) => [...prev, resp.data]);
      }
    } catch (err) {
      // Se houver erro de validação/backend, mostra no console e em mensagem
      console.error("Erro ao cadastrar material:", err.response || err);
      setTipoMensagem("error");
      setMensagem(
        err.response?.data?.message ||
          "Erro ao cadastrar material. Verifique a conexão com o backend."
      );
    } finally {
      setCarregando(false); // desativa loading
    }
  };

  return (
    <div className="cadastro-materiais-page">
      <main className="main-content-cadastro">
        <header className="cadastro-header">
          <h1 className="cadastro-title">Cadastro de Materiais:</h1>
        </header>

        {/* Mostra mensagem (sucesso/erro) */}
        {mensagem && (
          <p className={`cadastro-message ${tipoMensagem}`}>{mensagem}</p>
        )}

        {/* Formulário que envia para handleSubmit */}
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="form-input-row">
            {/* Campo nome_material */}
            <div className="input-group">
              <label className="cadastro-label">
                Nome:
                <input
                  type="text"
                  className="cadastro-input-dark"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Campo quant_estoque */}
            <div className="input-group">
              <label className="cadastro-label">
                Quantidade:
                <input
                  type="number"
                  className="cadastro-input-dark"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0"
                  required
                />
              </label>
            </div>

            {/* Campo descricao_material (opcional) */}
            <div className="input-group">
              <label className="cadastro-label">
                Descrição:
                <input
                  type="text"
                  className="cadastro-input-dark"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </label>
            </div>

            {/* Campo valor_material */}
            <div className="input-group">
              <label className="cadastro-label">
                Valor:
                <input
                  type="text"
                  className="cadastro-input-dark"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </label>
            </div>
          </div>

          {/* Tabela exibindo materiais cadastrados nesta sessão */}
          <div className="tabela-container">
            <table className="materiais-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                </tr>
              </thead>

              <tbody>
                {/* Renderiza cada material salvo no estado */}
                {materiaisExistentes.map((mat, index) => (
                  <tr key={index}>
                    <td>{mat.nome_material}</td>
                    <td>{mat.quant_estoque}</td>
                    <td>
                      R${" "}
                      {parseFloat(mat.valor_material)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                    <td>{mat.descricao_material}</td>
                  </tr>
                ))}

                {/* Linhas vazias mantidas apenas para o layout visual */}
                <tr>
                  <td colSpan="4" className="empty-row"></td>
                </tr>
                <tr>
                  <td colSpan="4" className="empty-row"></td>
                </tr>
                <tr>
                  <td colSpan="4" className="empty-row"></td>
                </tr>
                <tr>
                  <td colSpan="4" className="empty-row"></td>
                </tr>
                <tr>
                  <td colSpan="4" className="empty-row"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Botão de submit */}
          <div className="salvar-button-container">
            <button type="submit" className="salvar-button" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </main>

      {/* Botão de navegação para voltar à tela inicial */}
      <button className="voltar-button" onClick={irParaInicial}>
        Voltar
      </button>
    </div>
  );
}

export default CadastroMateriais;
