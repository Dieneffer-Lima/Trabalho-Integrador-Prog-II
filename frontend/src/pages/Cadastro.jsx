// Importa hook useState para controlar os campos do formulário
import { useState } from "react";
// Importa axios (pode ser usado para futuras requisições)
import axios from "axios";
// Importa o CSS compartilhado com a tela de login
import "../styles/login.css";
// Importa o logo exibido na tela
import logo from "../assets/logo.png";

// URL base da API do backend
const API_URL = "http://localhost:3001/api";

// Componente responsável pelo cadastro de usuários
function Cadastro({ irParaLogin }) {
  // Estados dos campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Define o perfil do usuário cadastrado
  const [tipoUsuario, setTipoUsuario] = useState("ADMIN");

  // Estados auxiliares para controle da interface
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  // Função chamada ao enviar o formulário de cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setTipoMensagem("success");
    setCarregando(true);

    try {
      // Envia os dados do usuário para o backend
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

      // Caso o backend retorne erro
      if (!resp.ok) {
        setTipoMensagem("error");
        setMensagem("Não foi possível realizar o cadastro.");
        return;
      }

      // Cadastro realizado com sucesso
      setTipoMensagem("success");
      setMensagem("Cadastro realizado com sucesso!");

      // Limpa os campos após o cadastro
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

  // Renderização da tela de cadastro
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={logo} alt="Logo Borracharia" />
        </div>

        <h1 className="login-title">Cadastro</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Nome completo:
            <input
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha:
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          <label>
            Tipo de usuário:
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <option value="ADMIN">Administrador</option>
              <option value="OPERADOR">Operador de Caixa</option>
            </select>
          </label>

          {mensagem && (
            <p className={tipoMensagem}>{mensagem}</p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <button onClick={irParaLogin}>
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

// Exporta o componente
export default Cadastro;
