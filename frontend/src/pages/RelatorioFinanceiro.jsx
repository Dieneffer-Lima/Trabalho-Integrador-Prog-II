// frontend/src/pages/RelatorioFinanceiro.jsx

// Importa o React e o hook useState para controlar estados de carregamento e erro
import React, { useState } from 'react';
// Importa o axios para fazer requisições HTTP para a API (GET/POST/etc.)
import axios from 'axios';
// Importa o CSS específico da tela de relatório
import '../styles/relatorioFinanceiro.css';

// URL base do módulo de relatórios no backend
const API_URL = 'http://localhost:3001/api/relatorios';

// Componente recebe a função de navegação de volta para a área administrativa (TelaInicial)
function RelatorioFinanceiro({ irParaInicial }) {
    // loading controla se a requisição está em andamento (desabilita botão e mostra mensagem)
    const [loading, setLoading] = useState(false);
    // error armazena uma mensagem de erro para exibir ao usuário, se a API falhar
    const [error, setError] = useState(null);

    // Função disparada ao clicar no botão de gerar relatório
    const handleGenerateReport = async () => {
        // Ativa o modo de carregamento e limpa erros anteriores
        setLoading(true);
        setError(null);

        try {
            // Define o endpoint específico do relatório de vendas brutas
            const endpoint = `${API_URL}/vendas/bruto`; 
            
            // Realiza requisição GET ao backend para buscar o total de vendas brutas
            const response = await axios.get(endpoint);

            // Exibe um alerta com o valor total retornado pela API, formatado com 2 casas decimais
            alert(
              `Relatório de Vendas BRUTAS gerado com sucesso! Valor total: R$ ${response.data.valor_total.toFixed(2)}`
            );

        } catch (err) {
            // Log no console para facilitar debug (erro de rede, rota inexistente, erro 500, etc.)
            console.error(`Erro ao gerar relatório bruto:`, err);
            // Mensagem amigável para o usuário final
            setError(`Falha ao gerar o relatório de vendas brutas. Verifique o console.`);
        } finally {
            // Desativa o modo de carregamento independentemente de sucesso ou falha
            setLoading(false);
        }
    };

    // Renderização da tela
    return (
        <div className="relatorio-container">
            {/* Título da página (apenas interface) */}
            <h1 className="relatorio-titulo">📊 Geração de Relatórios Financeiros</h1>
            
            {/* Texto descritivo da função da tela */}
            <p className="relatorio-descricao">
                Gere o relatório de vendas brutas (receita total) do sistema.
            </p>

            <div className="botoes-relatorio">
                {/* Botão que chama a função de gerar relatório */}
                <button 
                    className="botao-acao botao-bruto" 
                    onClick={handleGenerateReport}
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    Gerar Relatório de Vendas BRUTO
                </button>
            </div>

            {/* Exibe feedback de carregamento enquanto a requisição está em andamento */}
            {loading && (
                <div className="status-mensagem mensagem-loading">
                    Gerando Relatório Bruto...
                </div>
            )}

            {/* Exibe mensagem de erro se a requisição falhar */}
            {error && (
                <div className="status-mensagem mensagem-erro">
                    {error}
                </div>
            )}

            {/* Botão para voltar para a tela inicial administrativa */}
            <button 
                className="logout-button" 
                onClick={irParaInicial}
                style={{ marginTop: '30px', width: '100%' }}
            >
                Voltar à Área Administrativa
            </button>
        </div>
    );
}

// Exporta o componente para uso no App.jsx
export default RelatorioFinanceiro;
