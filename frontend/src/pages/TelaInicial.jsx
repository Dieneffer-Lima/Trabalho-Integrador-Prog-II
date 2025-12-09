// frontend/src/pages/TelaInicial.jsx

import React, { useEffect, useState } from "react";
import "../styles/telaInicial.css";
import logo from "../assets/logo.png";

function TelaInicial({
  irParaEstoque,
  irParaCadastroMateriais,
  irParaCadastroServicos,
  irParaCadastroDespesas,
  irParaCaixa,
  handleLogout,
  irParaRelatorioFinanceiro, 
}) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioJson = localStorage.getItem("usuario");
    if (usuarioJson) {
      setUsuario(JSON.parse(usuarioJson));
    } else {
      handleLogout();
    }
  }, [handleLogout]);

  if (!usuario) return <div>Carregando...</div>;

  return (
    <div className="tela-inicial-page">
      {/* BARRA SUPERIOR PRETA */}
      <header className="header-top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
      </header>

      <div className="main-layout">
        {/* SIDEBAR ESQUERDA */}
        <aside className="sidebar-ajustada">
          <p className="usuario-tipo-label">
            {usuario.tipo_usuario}
            <br />
            {usuario.nome_completo || usuario.email}
          </p>

          <button className="logout-button" onClick={handleLogout}>
            Voltar à Tela de Login
          </button>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="main-content-ajustada">
          <h1 className="main-title">Área Administrativa</h1>

          <div className="funcionalidades-grid">
            {/* ESTOQUE */}
            <button className="funcionalidade-card" onClick={irParaEstoque}>
              <span className="funcionalidade-nome">Controle de Estoque</span>
            </button>

            {/* CAIXA */}
            <button className="funcionalidade-card" onClick={irParaCaixa}>
              <span className="funcionalidade-nome">
                Caixa (Gestão de Serviços)
              </span>
            </button>

            {/* CADASTRO DE MATERIAIS */}
            <button
              className="funcionalidade-card"
              onClick={irParaCadastroMateriais}
            >
              <span className="funcionalidade-nome">
                Cadastro de Materiais
              </span>
            </button>

            {/* CADASTRO DE DESPESAS */}
            <button
              className="funcionalidade-card"
              onClick={irParaCadastroDespesas}
            >
              <span className="funcionalidade-nome">Cadastro de Despesas</span>
            </button>

            {/* CADASTRO DE SERVIÇOS */}
            <button
              className="funcionalidade-card"
              onClick={irParaCadastroServicos}
            >
              <span className="funcionalidade-nome">Cadastro de Serviços</span>
            </button>
            
            {/* RELATÓRIO FINANCEIRO ) */}
            <button 
              className="funcionalidade-card"
              onClick={irParaRelatorioFinanceiro} 
            >
              <span className="funcionalidade-nome">
                Relatórios de Vendas Bruto
              </span>
            </button>

            
          </div>
        </main>
      </div>
    </div>
  );
}

export default TelaInicial;