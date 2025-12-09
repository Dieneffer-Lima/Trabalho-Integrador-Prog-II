// frontend/src/pages/Cadastro.jsx
import { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import logo from "../assets/logo.png"; // 👈 igual no Login


const API_URL = "http://localhost:3001/api";

function Cadastro({ irParaLogin }) {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("ADMIN"); // ADMIN | OPERADOR
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setTipoMensagem("success");
    setCarregando(true);

    try {
      // aqui você pode apontar para a rota real de cadastro
      // Exemplo: /auth/register ou /usuarios
      const resp = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_completo: nomeCompleto,
          email,
          senha,
          tipo_usuario: tipoUsuario,
        }),
      });

      if (!resp.ok) {
        setTipoMensagem("error");
        setMensagem("Não foi possível realizar o cadastro.");
        return;
      }

      setTipoMensagem("success");
      setMensagem("Cadastro realizado com sucesso!");
      // se quiser, limpa o formulário
      setNomeCompleto("");
      setEmail("");
      setSenha("");
      setTipoUsuario("ADMIN");
    } catch (err) {
      console.error(err);
      setTipoMensagem("error");
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-container">
          <img
            src={logo}
            alt="Logo Borracharia Pereira Lima"
            className="login-logo"
          />
        </div>

        <h1 className="login-title">Cadastro</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Nome completo:
            <input
              type="text"
              className="login-input"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
            />
          </label>

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

          <label className="login-label">
            Tipo de usuário:
            <select
              className="login-input"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="ADMIN">Administrador</option>
              <option value="OPERADOR">Operador de Caixa</option>
            </select>
          </label>

          {mensagem && (
            <p className={`login-message ${tipoMensagem}`}>{mensagem}</p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <button
          type="button"
          className="login-secondary-button"
          onClick={irParaLogin}
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

export default Cadastro;
