// frontend/src/App.jsx

import React, { useState } from "react";
import "./styles/App.css";

// Páginas
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
// 🚨 NOVA IMPORTAÇÃO 🚨
import RelatorioFinanceiro from "./pages/RelatorioFinanceiro.jsx"; 

function App() {
  // define tela inicial com base no token
  const [telaAtual, setTelaAtual] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? "Inicial" : "Login";
  });

  // guarda o id da venda a prazo (para usar na nota fiscal)
  const [vendaPrazoId, setVendaPrazoId] = useState(null);

  // --------- Funções de navegação ---------
  const irParaLogin = () => setTelaAtual("Login");
  const irParaCadastro = () => setTelaAtual("Cadastro");
  const irParaInicial = () => setTelaAtual("Inicial");
  const irParaEstoque = () => setTelaAtual("Estoque");
  const irParaCadastroMateriais = () => setTelaAtual("CadastroMateriais");
  const irParaCadastroServicos = () => setTelaAtual("CadastroServicos");
  const irParaEntradaEstoque = () => setTelaAtual("EntradaEstoque");
  const irParaCadastroDespesas = () => setTelaAtual("CadastroDespesas");
  const irParaCaixa = () => setTelaAtual("Caixa");

  // 🚨 NOVA FUNÇÃO DE NAVEGAÇÃO 🚨
  const irParaRelatorioFinanceiro = () => setTelaAtual("RelatorioFinanceiro");

  // chamada específica quando a venda é a prazo
  const irParaCadastroNotaFiscal = (idVenda) => {
    if (idVenda) {
      setVendaPrazoId(idVenda);
      // opcional: salvar também no localStorage, se quiser
      try {
        const ultimaVenda = { id_venda: idVenda };
        localStorage.setItem("ultimaVenda", JSON.stringify(ultimaVenda));
      } catch (e) {
        console.error("Erro ao salvar ultimaVenda:", e);
      }
    }
    setTelaAtual("CadastroNotaFiscal");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("ultimaVenda");
    irParaLogin();
  };

  // --------- Decide qual tela renderizar ---------
  const renderizarTela = () => {
    switch (telaAtual) {
      case "Login":
        return (
          <Login
            irParaInicial={irParaInicial}
            irParaCadastro={irParaCadastro}
          />
        );

      case "Cadastro":
        return <Cadastro irParaLogin={irParaLogin} />;

      case "Inicial":
        return (
          <TelaInicial
            irParaEstoque={irParaEstoque}
            irParaCadastroMateriais={irParaCadastroMateriais}
            irParaCadastroServicos={irParaCadastroServicos}
            irParaCadastroDespesas={irParaCadastroDespesas}
            irParaCaixa={irParaCaixa}
            handleLogout={handleLogout}
            // 🚨 PASSA A NOVA PROP 🚨
            irParaRelatorioFinanceiro={irParaRelatorioFinanceiro} 
          />
        );

      case "Estoque":
        return (
          <ControleEstoque
            irParaInicial={irParaInicial}
            irParaEntradaEstoque={irParaEntradaEstoque}
            handleLogout={handleLogout}
          />
        );

      case "CadastroMateriais":
        return <CadastroMateriais irParaInicial={irParaInicial} />;

      case "CadastroServicos":
        return <CadastroServicos irParaInicial={irParaInicial} />;

      case "EntradaEstoque":
        return (
          <EntradaEstoque
            irParaControleEstoque={irParaEstoque}
          />
        );

      case "CadastroDespesas":
        return <CadastroDespesas irParaInicial={irParaInicial} />;

      case "Caixa":
        return (
          <CaixaServicos
            irParaInicial={irParaInicial}
            irParaCadastroNotaFiscal={irParaCadastroNotaFiscal}
          />
        );

      case "CadastroNotaFiscal":
        return (
          <CadastroNotaFiscal
            irParaInicial={irParaInicial}
            vendaId={vendaPrazoId}
          />
        );

      // 🚨 NOVO CASE PARA O RELATÓRIO 🚨
      case "RelatorioFinanceiro":
        return (
          <RelatorioFinanceiro 
            irParaInicial={irParaInicial} 
          />
        );

      default:
        return (
          <Login
            irParaInicial={irParaInicial}
            irParaCadastro={irParaCadastro}
          />
        );
    }
  };

  return <div className="App">{renderizarTela()}</div>;
}

export default App;