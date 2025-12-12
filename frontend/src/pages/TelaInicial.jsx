// frontend/src/pages/TelaInicial.jsx

// Importa o React e dois hooks: useState (estado do componente) e useEffect (efeitos ao montar/atualizar)
import React, { useEffect, useState } from "react";
// Importa o CSS específico desta página para estilização
import "../styles/telaInicial.css";
// Importa a imagem da logo para exibir no header
import logo from "../assets/logo.png";

// Componente TelaInicial recebe funções de navegação e logout via props (passadas pelo App.jsx)
function TelaInicial({
  irParaEstoque,
  irParaCadastroMateriais,
  irParaCadastroServicos,
  irParaCadastroDespesas,
  irParaCaixa,
  handleLogout,
  irParaRelatorioFinanceiro,
}) {
  // Estado que armazena o usuário logado (carregado do localStorage)
  const [usuario, setUsuario] = useState(null);

  // Executa quando o componente é montado e quando handleLogout muda (dependência do hook)
  useEffect(() => {
    // Busca do localStorage os dados do usuário salvos no login
    const usuarioJson = localStorage.getItem("usuario");

    // Se existir usuário no localStorage, converte de JSON para objeto e salva no estado
    if (usuarioJson) {
      setUsuario(JSON.parse(usuarioJson));
    } else {
      // Se não existir usuário, significa que não há sessão válida: faz logout e volta para Login
      handleLogout();
    }
  }, [handleLogout]);

  // Enquanto o usuário ainda não foi carregado, mostra uma mensagem simples de carregamento
  if (!usuario) return <div>Carregando...</div>;

  // Normaliza o tipo de usuário para evitar erro de comparação (minúsculas e fallback para string vazia)
  const tipoUsuario = (usuario.tipo_usuario || "").toLowerCase();

  // Define se o usuário é operador de caixa (qualquer um desses valores será tratado como "caixa")
  const ehOperadorCaixa =
    tipoUsuario === "operador_caixa" ||
    tipoUsuario === "caixa" ||
    tipoUsuario === "operador";

  // Renderização da interface da tela inicial (área administrativa)
  return (
    <div className="tela-inicial-page">
      {/* Header superior com a logo do sistema */}
      <header className="header-top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
      </header>

      <div className="main-layout">
        {/* Sidebar lateral esquerda com informações do usuário logado e botão de logout */}
        <aside className="sidebar-ajustada">
          <p className="usuario-tipo-label">
            {/* Exibe o tipo do usuário (admin/operador etc.) */}
            {usuario.tipo_usuario}
            <br />
            {/* Exibe nome completo se existir, senão mostra o email */}
            {usuario.nome_completo || usuario.email}
          </p>

          {/* Botão que limpa a sessão e retorna para a tela de login */}
          <button className="logout-button" onClick={handleLogout}>
            Voltar à Tela de Login
          </button>
        </aside>

        {/* Área principal com os botões que levam para as funcionalidades */}
        <main className="main-content-ajustada">
          <h1 className="main-title">Área Administrativa</h1>

          <div className="funcionalidades-grid">
            {/* Se o usuário for operador de caixa, mostra apenas a opção do Caixa */}
            {ehOperadorCaixa ? (
              <button className="funcionalidade-card" onClick={irParaCaixa}>
                <span className="funcionalidade-nome">
                  Caixa (Gestão de Serviços)
                </span>
              </button>
            ) : (
              <>
                {/* Botão para acessar o controle de estoque */}
                <button className="funcionalidade-card" onClick={irParaEstoque}>
                  <span className="funcionalidade-nome">
                    Controle de Estoque
                  </span>
                </button>

                {/* Botão para acessar o caixa (registro de vendas/serviços) */}
                <button className="funcionalidade-card" onClick={irParaCaixa}>
                  <span className="funcionalidade-nome">
                    Caixa (Gestão de Serviços)
                  </span>
                </button>

                {/* Botão para acessar o cadastro/gerenciamento de materiais */}
                <button
                  className="funcionalidade-card"
                  onClick={irParaCadastroMateriais}
                >
                  <span className="funcionalidade-nome">
                    Cadastro de Materiais
                  </span>
                </button>

                {/* Botão para acessar o cadastro/gerenciamento de despesas */}
                <button
                  className="funcionalidade-card"
                  onClick={irParaCadastroDespesas}
                >
                  <span className="funcionalidade-nome">Cadastro de Despesas</span>
                </button>

                {/* Botão para acessar o cadastro/gerenciamento de serviços */}
                <button
                  className="funcionalidade-card"
                  onClick={irParaCadastroServicos}
                >
                  <span className="funcionalidade-nome">
                    Cadastro de Serviços
                  </span>
                </button>

                {/* Botão para acessar a tela de relatórios financeiros */}
                <button
                  className="funcionalidade-card"
                  onClick={irParaRelatorioFinanceiro}
                >
                  <span className="funcionalidade-nome">
                    Relatórios de Vendas Bruto
                  </span>
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Exporta o componente para ser importado no App.jsx
export default TelaInicial;
