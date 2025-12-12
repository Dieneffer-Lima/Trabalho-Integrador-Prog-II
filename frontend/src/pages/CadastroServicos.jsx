// frontend/src/pages/CadastroServicos.jsx

// Importa React e hooks para estado e carregamento ao abrir a tela
import React, { useState, useEffect } from "react";
// Importa o CSS da tela de cadastro de serviços
import "../styles/cadastroServicos.css";
// Importa instância configurada do axios para consumo do backend
import api from "../api";

// Componente de cadastro/listagem de serviços
// Recebe função de navegação para voltar à tela inicial
function CadastroServicos({ irParaInicial }) {
  // Campos do formulário (nome e valor)
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");

  // Mensagem de feedback para o usuário (sucesso/erro)
  const [mensagem, setMensagem] = useState(null);
  // Controla estado de carregamento durante o POST de cadastro
  const [carregando, setCarregando] = useState(false);

  // Lista de serviços exibida na tabela (carregada do backend)
  const [servicos, setServicos] = useState([]);

  // Ao abrir a tela, carrega os serviços já cadastrados no backend
  useEffect(() => {
    const carregarServicos = async () => {
      try {
        // Requisição GET para buscar serviços cadastrados
        const resp = await api.get("/servicos");

        // Converte os dados para uma lista padronizada
        const lista = resp.data.map((item) => ({
          id: item.id_servico,
          nome: item.nome_servico,
          valor: item.valor_servico,
        }));

        // Atualiza estado para renderizar na tabela
        setServicos(lista);
      } catch (err) {
        // Registra no console para debug
        console.error(err);
        // Mensagem amigável para o usuário
        setMensagem({ tipo: "erro", texto: "Erro ao carregar serviços." });
      }
    };

    carregarServicos();
  }, []);

  // Função executada ao enviar o formulário de cadastro
  const handleSubmit = async (e) => {
    // Evita recarregar a página ao submeter o form
    e.preventDefault();

    // Limpa mensagens anteriores
    setMensagem(null);

    // Valida se os campos foram preenchidos
    if (!nome || !valor) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    // Ativa carregamento para evitar envio duplicado
    setCarregando(true);

    try {
      // Monta objeto no formato esperado pelo backend
      const payload = {
        nome_servico: nome,
        // Converte valor digitado com vírgula para padrão numérico com ponto
        valor_servico: parseFloat(valor.replace(",", ".")),
      };

      // Requisição POST para cadastrar serviço no backend
      const resp = await api.post("/servicos", payload);

      // Mensagem de sucesso após cadastro
      setMensagem({
        tipo: "sucesso",
        texto: `Serviço "${nome}" cadastrado com sucesso!`,
      });

      // Limpa campos do formulário
      setNome("");
      setValor("");

      // Atualiza a tabela adicionando o objeto retornado do backend
      // resp.data deve conter o serviço criado (incluindo id_servico)
      setServicos((prev) => [...prev, resp.data]);
    } catch (err) {
      // Mostra detalhes do erro no console (inclui resposta do backend se houver)
      console.error("ERRO NO POST /servicos:", err.response?.data || err);

      // Mensagem amigável usando o message do backend quando existir
      setMensagem({
        tipo: "erro",
        texto:
          err.response?.data?.message ||
          "Erro ao cadastrar serviço (ver console do navegador).",
      });
    } finally {
      // Desativa carregamento ao final
      setCarregando(false);
    }
  };

  // Renderização da tela de cadastro e listagem
  return (
    <div className="cadastro-servicos-page">
      <main className="main-content-servicos">
        <header className="servicos-header">
          <h1 className="servicos-title">Cadastro de Serviços</h1>
        </header>

        {/* Exibe mensagem se existir */}
        {mensagem && (
          <div
            className={`mensagem ${mensagem.tipo}`}
            style={{ marginBottom: "15px" }}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Formulário de cadastro */}
        <form className="servicos-form" onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Input de nome do serviço */}
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

            {/* Input de valor do serviço */}
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

          {/* Botão de salvar (submit) */}
          <div className="salvar-container">
            <button
              type="submit"
              className="salvar-button"
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {/* Tabela de serviços cadastrados */}
          <div className="tabela-container">
            <table className="servicos-tabela">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {/* Renderiza a lista de serviços */}
                {servicos.map((s) => (
                  <tr key={s.id}>
                    {/* Compatibilidade: às vezes o objeto vem como nome_servico/valor_servico, às vezes como nome/valor */}
                    <td>{s.nome_servico || s.nome}</td>
                    <td>
                      R$
                      {Number(s.valor_servico || s.valor)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  </tr>
                ))}

                {/* Se não houver registros, mostra mensagem na tabela */}
                {servicos.length === 0 && (
                  <tr>
                    <td colSpan="2">Nenhum serviço cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </form>

        {/* Botão para voltar para a área administrativa */}
        <button className="voltar-button" onClick={irParaInicial}>
          Voltar
        </button>
      </main>
    </div>
  );
}

// Exporta o componente para uso no App.jsx
export default CadastroServicos;
