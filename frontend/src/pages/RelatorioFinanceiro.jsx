// frontend/src/pages/RelatorioFinanceiro.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/relatorioFinanceiro.css'; // Importa o CSS

// URL base da sua API
const API_URL = 'http://localhost:3001/api/relatorios';

function RelatorioFinanceiro({ irParaInicial }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Não precisamos mais de reportType no estado, já que é fixo
    
    // Função para buscar os dados no backend (agora só Vendas Brutas)
    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);

        try {
            // Endpoint fixo para Vendas Brutas
            const endpoint = `${API_URL}/vendas/bruto`; 
            
            const response = await axios.get(endpoint);

            // Exibe o resultado. 
            alert(`Relatório de Vendas BRUTAS gerado com sucesso! Valor total: R$ ${response.data.valor_total.toFixed(2)}`);

        } catch (err) {
            console.error(`Erro ao gerar relatório bruto:`, err);
            setError(`Falha ao gerar o relatório de vendas brutas. Verifique o console.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relatorio-container">
            <h1 className="relatorio-titulo">📊 Geração de Relatórios Financeiros</h1>
            
            <p className="relatorio-descricao">
                Gere o relatório de vendas brutas (receita total) do sistema.
            </p>

            <div className="botoes-relatorio">
                {/* Botão Vendas Brutas - ÚNICO */}
                <button 
                    className="botao-acao botao-bruto" 
                    onClick={handleGenerateReport}
                    disabled={loading}
                    style={{ width: '100%' }} // Estica o botão para preencher o container
                >
                    Gerar Relatório de Vendas BRUTO
                </button>
            </div>

            {loading && (
                <div className="status-mensagem mensagem-loading">
                    Gerando Relatório Bruto...
                </div>
            )}

            {error && (
                <div className="status-mensagem mensagem-erro">
                    {error}
                </div>
            )}

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

export default RelatorioFinanceiro;