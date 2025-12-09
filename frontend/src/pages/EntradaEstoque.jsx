// frontend/src/pages/EntradaEstoque.jsx (INTEGRAÇÃO COM BACKEND REAL)

import React, { useState, useEffect } from 'react';
import api from '../api'; // Importa a instância do Axios configurada
import '../styles/entradaEstoque.css';

function EntradaEstoque({ irParaControleEstoque }) {
    
    const [materialId, setMaterialId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [mensagem, setMensagem] = useState(null);
    const [materiais, setMateriais] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Efeito para carregar materiais existentes do backend para o <select>
    useEffect(() => {
        const fetchMateriais = async () => {
            setIsLoading(true);
            setMensagem(null);
            try {
                // Endpoint para listagem de materiais
                const response = await api.get('/materiais'); 

                const dadosMateriais = response.data.map(item => ({
                    id: item.id_material,
                    nome: item.nome_material,
                    quantidade: item.quant_estoque, // Estoque atual para exibição
                }));

                setMateriais(dadosMateriais);

            } catch (err) {
                console.error('Erro ao buscar materiais:', err);
                setMensagem({ type: 'error', text: 'Erro ao carregar lista de materiais. Verifique o backend.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchMateriais();
    }, []);

    // 2. Função para registrar a entrada de estoque no backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem(null); // Limpa mensagens anteriores
        
        const quantidadeAdicionar = parseInt(quantidade);

        if (!materialId || quantidadeAdicionar <= 0 || isNaN(quantidadeAdicionar)) {
            setMensagem({ type: 'error', text: 'Selecione um material e informe uma quantidade válida.' });
            return;
        }
        
        const materialSelecionado = materiais.find(m => m.id === parseInt(materialId));

        try {
            const payload = {
                id_material: parseInt(materialId),
                quantidade: quantidadeAdicionar,
                // id_usuario, data, etc. (se necessário)
            };

            // Envia a requisição POST para o backend. 
            // O backend deve ter a lógica para somar 'quantidadeAdicionar' ao 'quant_estoque' do material.
            // Ajuste o endpoint se ele for diferente no seu backend
            await api.post('/estoque/entrada', payload); 

            setMensagem({ 
                type: 'success', 
                text: `Entrada de ${quantidadeAdicionar} unidades de ${materialSelecionado.nome} registrada com sucesso no banco de dados!`
            });
            
            // Limpa o formulário após o sucesso
            setMaterialId('');
            setQuantidade('');

        } catch (err) {
            console.error('Erro ao registrar entrada de estoque:', err);
            setMensagem({ 
                type: 'error', 
                text: 'Falha ao registrar entrada. Verifique o console e o endpoint POST /estoque/entrada no seu backend.'
            });
        }
    };

    return (
        <div className="entrada-estoque-page">
            <div className="main-content-entrada">
                
                <header className="entrada-header">
                    <h1 className="entrada-title">Adicionar Produto ao Estoque</h1>
                </header>

                <button className="voltar-button" onClick={irParaControleEstoque}>
                    Voltar
                </button>

                <form onSubmit={handleSubmit} className="entrada-form">
                    
                    {mensagem && (
                        <div className={`mensagem ${mensagem.type}`}>
                            {mensagem.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="material">Selecione o Material:</label>
                        {isLoading ? (
                             <p>Carregando materiais do banco de dados...</p>
                        ) : (
                            <select 
                                id="material" 
                                value={materialId} 
                                onChange={(e) => { setMaterialId(e.target.value); setMensagem(null); }}
                                required
                            >
                                <option value="">-- Selecione um material --</option>
                                {/* Apenas materiais previamente cadastrados são listados pelo backend */}
                                {materiais.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.nome} (Estoque atual: {material.quantidade})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade a Adicionar:</label>
                        <input 
                            type="number" 
                            id="quantidade" 
                            value={quantidade} 
                            onChange={(e) => { setQuantidade(e.target.value); setMensagem(null); }}
                            min="1"
                            placeholder="Ex: 50"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="adicionar-button">
                            Registrar Entrada
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default EntradaEstoque;