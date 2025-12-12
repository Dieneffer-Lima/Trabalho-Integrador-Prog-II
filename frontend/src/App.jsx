// frontend/src/App.jsx

// Importa React e o hook useState para controlar o estado de navegação (tela atual) dentro do App
import React, { useState } from "react";
// Importa o CSS geral do componente App
import "./styles/App.css";

// Importa as páginas/telas que serão renderizadas conforme a navegação
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import TelaInicial from "./pages/TelaInicial.jsx";
import ControleEstoque from "./pages/ControleEstoque.jsx";
import CadastroMateriais from "./pages/CadastroMateriais.jsx";
import CadastroServicos from "./pages/CadastroServicos.jsx";
import EntradaEstoque from "./pages/EntradaEstoque.jsx";
import CadastroDespesas from "./pages/CadastroDespesas.jsx";
import CaixaServicos from "./pages/CaixaServicos.jsx";
import CadastroNotaFiscal from "./pages/CadastroNotaFiscal.jsx";
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro.jsx";

function App() {
  // Estado que controla qual tela o sistema está exibindo no momento
  // Se existir token no localStorage, assume que o usuário já está logado e inicia na tela "Inicial"
  const [telaAtual, setTelaAtual] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? "Inicial" : "Login";
  });

  // Estado que guarda o id de uma venda a prazo, para ser reutilizado na tela de cadastro de nota fiscal
  const [vendaPrazoId, setVendaPrazoId] = useState(null);

  // Lê do localStorage os dados do usuário logado (salvos no login)
  // Isso permite controlar permissões no frontend, como restringir telas para o operador de caixa
  const usuarioStr = localStorage.getItem("usuario");
  const usuarioObj = usuarioStr ? JSON.parse(usuarioStr) : null;

  // Extrai o tipo de usuário e padroniza para minúsculas para facilitar comparação
  const tipoUsuario = (usuarioObj?.tipo_usuario || "").toLowerCase();

  // Define se o usuário atual é um operador de caixa (permite variações no texto)
  const ehOperadorCaixa =
    tipoUsuario === "operador_caixa" ||
    tipoUsuario === "caixa" ||
    tipoUsuario === "operador";

  // Funções de navegação: alteram o estado telaAtual para a tela correspondente
  const irParaLogin = () => setTelaAtual("Login");
  const irParaCadastro = () => setTelaAtual("Cadastro");
  const irParaInicial = () => setTelaAtual("Inicial");
  const irParaEstoque = () => setTelaAtual("Estoque");
  const irParaCadastroMateriais = () => setTelaAtual("CadastroMateriais");
  const irParaCadastroServicos = () => setTelaAtual("CadastroServicos");
  const irParaEntradaEstoque = () => setTelaAtual("EntradaEstoque");
  const irParaCadastroDespesas = () => setTelaAtual("CadastroDespesas");
  const irParaCaixa = () => setTelaAtual("Caixa");
  const irParaRelatorioFinanceiro = () => setTelaAtual("RelatorioFinanceiro");

  // Função de navegação específica usada quando uma venda foi feita a prazo
  // Ela salva o id da venda em um estado (para passar para CadastroNotaFiscal)
  // e também salva no localStorage, para recuperar mesmo se recarregar a página
  const irParaCadastroNotaFiscal = (idVenda) => {
    if (idVenda) {
      setVendaPrazoId(idVenda);

      try {
        const ultimaVenda = { id_venda: idVenda };
        localStorage.setItem("ultimaVenda", JSON.stringify(ultimaVenda));
      } catch (e) {
        console.error("Erro ao salvar ultimaVenda:", e);
      }
    }

    // Após salvar o id, navega para a tela de nota fiscal
    setTelaAtual("CadastroNotaFiscal");
  };

  // Logout: remove dados da sessão e volta para tela de login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("ultimaVenda");
    irParaLogin();
  };

  // Função responsável por decidir qual componente de tela deve ser renderizado
  const renderizarTela = () => {
    // Regra de autorização no frontend:
    // Se o usuário for operador de caixa, ele só pode acessar: Inicial e Caixa
    // Se tentar acessar qualquer outra tela, a navegação é forçada para "Caixa"
    if (
      ehOperadorCaixa &&
      !["Inicial", "Caixa", "Login", "Cadastro"].includes(telaAtual)
    ) {
      // Força o estado para Caixa para impedir o acesso a outras telas
      setTelaAtual("Caixa");

      // Retorna diretamente o componente Caixa para não renderizar a tela proibida
      return (
        <CaixaServicos
          irParaInicial={irParaInicial}
          irParaCadastroNotaFiscal={irParaCadastroNotaFiscal}
        />
      );
    }

    // Switch da navegação: decide o componente conforme o valor de telaAtual
    switch (telaAtual) {
      case "Login":
        // Tela de login recebe funções para navegar após login e para ir ao cadastro
        return (
          <Login
            irParaInicial={irParaInicial}
            irParaCadastro={irParaCadastro}
          />
        );

      case "Cadastro":
        // Tela de cadastro recebe função para voltar ao login
        return <Cadastro irParaLogin={irParaLogin} />;

      case "Inicial":
        // Tela inicial (área administrativa) recebe as funções que direcionam para as funcionalidades
        return (
          <TelaInicial
            irParaEstoque={irParaEstoque}
            irParaCadastroMateriais={irParaCadastroMateriais}
            irParaCadastroServicos={irParaCadastroServicos}
            irParaCadastroDespesas={irParaCadastroDespesas}
            irParaCaixa={irParaCaixa}
            handleLogout={handleLogout}
            irParaRelatorioFinanceiro={irParaRelatorioFinanceiro}
          />
        );

      case "Estoque":
        // Tela de controle de estoque: permite voltar, sair e ir para entrada de estoque
        return (
          <ControleEstoque
            irParaInicial={irParaInicial}
            irParaEntradaEstoque={irParaEntradaEstoque}
            handleLogout={handleLogout}
          />
        );

      case "CadastroMateriais":
        // Tela de cadastro de materiais retorna para a inicial
        return <CadastroMateriais irParaInicial={irParaInicial} />;

      case "CadastroServicos":
        // Tela de cadastro de serviços retorna para a inicial
        return <CadastroServicos irParaInicial={irParaInicial} />;

      case "EntradaEstoque":
        // Tela de entrada de estoque retorna para a tela de estoque
        return <EntradaEstoque irParaControleEstoque={irParaEstoque} />;

      case "CadastroDespesas":
        // Tela de despesas retorna para a inicial
        return <CadastroDespesas irParaInicial={irParaInicial} />;

      case "Caixa":
        // Tela do caixa (gestão de serviços e vendas)
        // Recebe função para voltar e para direcionar para nota fiscal quando venda for a prazo
        return (
          <CaixaServicos
            irParaInicial={irParaInicial}
            irParaCadastroNotaFiscal={irParaCadastroNotaFiscal}
          />
        );

      case "CadastroNotaFiscal":
        // Tela de nota fiscal recebe o id da venda a prazo (vendaPrazoId)
        return (
          <CadastroNotaFiscal
            irParaInicial={irParaInicial}
            vendaId={vendaPrazoId}
          />
        );

      case "RelatorioFinanceiro":
        // Tela de relatório financeiro retorna para a inicial
        return <RelatorioFinanceiro irParaInicial={irParaInicial} />;

      default:
        // Caso o estado telaAtual esteja com valor inesperado, volta para Login
        return (
          <Login
            irParaInicial={irParaInicial}
            irParaCadastro={irParaCadastro}
          />
        );
    }
  };

  // Renderiza a tela escolhida dentro do container principal
  return <div className="App">{renderizarTela()}</div>;
}

export default App;
