// frontend/src/pages/Login.jsx (Versão FINAL e CORRIGIDA)

import { useState } from "react";
// 🛑 IMPORTAÇÕES CORRETAS DE CSS: Verifique se o seu CSS está em 'src/styles/login.css'
import "../styles/login.css"; 
// import logo from "../assets/logo.png"; // Descomente e verifique o caminho se estiver usando logo

const API_URL = "http://localhost:3001/api";

// 🛑 Componente 'Login' com as props corretas para navegação
function Login({ irParaCadastro, irParaInicial }) { 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success"); // "error" | "success"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setTipoMensagem("success");
    setCarregando(true);

    try {
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setTipoMensagem("error");
        setMensagem(data.message || "Email ou senha inválidos.");
        return;
      }

      // Se for sucesso:
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setTipoMensagem("success");
      setMensagem("Login realizado com sucesso! Redirecionando...");
      
      // Chama a função que muda o estado no App.jsx para a tela Inicial
      setTimeout(() => {
        if (irParaInicial) {
          irParaInicial();
        }
      }, 500); 

    } catch (err) {
      console.error("Erro ao tentar fazer login:", err);
      setTipoMensagem("error");
      setMensagem("Erro ao conectar com o servidor."); // Isso cobre o ERR_CONNECTION_REFUSED
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Se você estiver usando o logo: 
        <div className="login-logo-container">
          <img src={logo} alt="Logo" className="login-logo" />
        </div> */}

        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Email:
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Senha:
            <input
              type="password"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {mensagem && (
            <p className={`login-message ${tipoMensagem}`}>{mensagem}</p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        {/* 🛑 O BOTÃO "CRIAR CADASTRO" QUE VOCÊ QUERIA */}
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

export default Login;