// frontend/src/pages/Login.jsx (Versão FINAL e CORRIGIDA)

// Importa o hook useState para controlar valores digitados e estados da tela
import { useState } from "react";
// Importa o CSS do login (estilos específicos da página)
import "../styles/login.css"; 
//import logo from "../assets/logo.png";

// URL base do backend (API) para autenticação
const API_URL = "http://localhost:3001/api";

// Componente Login recebe funções do App.jsx para navegar para Cadastro e para Inicial
function Login({ irParaCadastro, irParaInicial }) { 
  // Estado do campo de email digitado no formulário
  const [email, setEmail] = useState("");
  // Estado do campo de senha digitado no formulário
  const [senha, setSenha] = useState("");
  // Estado para bloquear botão e mostrar feedback durante a requisição
  const [carregando, setCarregando] = useState(false);
  // Texto de mensagem para feedback ao usuário (erro/sucesso)
  const [mensagem, setMensagem] = useState("");
  // Define a classe de estilo da mensagem ("error" ou "success")
  const [tipoMensagem, setTipoMensagem] = useState("success");

  // Função executada ao enviar o formulário de login
  const handleSubmit = async (e) => {
    // Evita recarregar a página ao submeter o form
    e.preventDefault();

    // Reseta mensagens anteriores
    setMensagem("");
    setTipoMensagem("success");

    // Ativa carregamento para desabilitar botão e evitar duplo clique
    setCarregando(true);

    try {
      // Envia requisição POST para o endpoint de login do backend
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        // Informa ao backend que o corpo está em JSON
        headers: { "Content-Type": "application/json" },
        // Envia email e senha no corpo da requisição
        body: JSON.stringify({ email, senha }),
      });

      // Converte a resposta do backend para JSON
      const data = await resp.json();

      // Se a resposta não for 2xx, trata como erro de autenticação
      if (!resp.ok) {
        setTipoMensagem("error");
        setMensagem(data.message || "Email ou senha inválidos.");
        return;
      }

      // Se for sucesso, salva token e dados do usuário no localStorage
      // Isso permite manter sessão e controlar permissões nas telas seguintes
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Feedback visual de sucesso
      setTipoMensagem("success");
      setMensagem("Login realizado com sucesso! Redirecionando...");
      
      // Aguarda um pequeno tempo e chama a navegação para a tela inicial
      setTimeout(() => {
        if (irParaInicial) {
          irParaInicial();
        }
      }, 500); 

    } catch (err) {
      // Captura erros de rede (backend desligado, URL errada, CORS, etc.)
      console.error("Erro ao tentar fazer login:", err);
      setTipoMensagem("error");
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      // Finaliza o carregamento em qualquer caso
      setCarregando(false);
    }
  };

  // Renderização da página de login
  return (
    <div className="login-page">
      <div className="login-card">
        {/* Exemplo de uso de logo no login (opcional):
        <div className="login-logo-container">
          <img src={logo} alt="Logo" className="login-logo" />
        </div> */}

        <h1 className="login-title">Login</h1>

        {/* Formulário de login chama handleSubmit ao enviar */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo de email controlado por estado */}
          <label className="login-label">
            Email:
            <input
              type="email"
              className="login-input"
              value={email}
              // Atualiza o estado ao digitar
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Campo de senha controlado por estado */}
          <label className="login-label">
            Senha:
            <input
              type="password"
              className="login-input"
              value={senha}
              // Atualiza o estado ao digitar
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {/* Exibe mensagem se houver conteúdo no estado mensagem */}
          {mensagem && (
            <p className={`login-message ${tipoMensagem}`}>{mensagem}</p>
          )}

          {/* Botão de submit desabilitado durante carregamento */}
          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {/* Texto do botão muda conforme o estado de carregamento */}
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        {/* Botão secundário para navegar para a tela de cadastro */}
        <button
          type="button"
          className="login-secondary-button"
          onClick={irParaCadastro}
        >
          Criar Cadastro
        </button>
      </div>
    </div>
  );
}

// Exporta o componente Login para uso no App.jsx
export default Login;
