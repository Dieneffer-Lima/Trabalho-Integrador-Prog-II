// frontend/src/pages/CadastroMateriais.jsx (CORRIGIDO)

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/cadastroMateriais.css'; 

// ⚠️ Mantenha o endereço da sua API aqui
const API_URL = "http://localhost:3001/api"; 

function CadastroMateriais({ irParaInicial }) {
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('success'); 
    
    // Simulação dos dados da tabela que será preenchida (futuramente buscar da API)
    const [materiaisExistentes, setMateriaisExistentes] = useState([]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        setCarregando(true);
        
        // Validação básica
        if (!nome || !quantidade || !valor) {
            setTipoMensagem('error');
            setMensagem('Por favor, preencha Nome, Quantidade e Valor.');
            setCarregando(false);
            return;
        }

        try {
            const token = localStorage.getItem('token'); 
            
            // 🚨 CORREÇÃO PRINCIPAL: Alinhar nomes dos campos com o modelo Sequelize (Backend)
            const novoMaterial = {
                nome_material: nome, // <--- Ajustado
                quant_estoque: parseInt(quantidade), // <--- Ajustado
                valor_material: parseFloat(valor.replace(',', '.')), // <--- Ajustado (e formata vírgula para ponto)
                descricao_material: descricao || null, // <--- Ajustado
            };
            
            // Endpoint POST: /api/materiais
            const resp = await axios.post(`${API_URL}/materiais`, novoMaterial, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (resp.status === 201) { 
                setTipoMensagem('success');
                setMensagem(`Material "${nome}" cadastrado com sucesso!`);
                
                // Limpa o formulário
                setNome('');
                setQuantidade('');
                setValor('');
                setDescricao('');

                // Adiciona o novo material à lista (para simular a atualização da tabela)
                // Nota: A resposta do seu backend deve retornar o objeto completo, se não, ajuste resp.data
                setMateriaisExistentes(prev => [...prev, resp.data]); 
            }

        } catch (err) {
            console.error("Erro ao cadastrar material:", err.response || err);
            setTipoMensagem('error');
            // Mostra a mensagem de erro específica do backend se disponível
            setMensagem(err.response?.data?.message || 'Erro ao cadastrar material. Verifique a conexão com o backend.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="cadastro-materiais-page">
            
            <main className="main-content-cadastro">
                
                {/* Cabeçalho da Seção */}
                <header className="cadastro-header">
                    <h1 className="cadastro-title">Cadastro de Materiais:</h1>
                </header>

                {/* Mensagens de Sucesso/Erro */}
                {mensagem && (
                    <p className={`cadastro-message ${tipoMensagem}`}>{mensagem}</p>
                )}

                <form className="cadastro-form" onSubmit={handleSubmit}>
                    
                    {/* Linha de Inputs */}
                    <div className="form-input-row">
                        {/* Envolve cada label/input em um grupo para melhor controle de layout */}
                        <div className="input-group">
                            <label className="cadastro-label">
                                Nome:
                                <input
                                    type="text"
                                    className="cadastro-input-dark" // Usa a classe escura
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label className="cadastro-label">
                                Quantidade:
                                <input
                                    type="number"
                                    className="cadastro-input-dark" // Usa a classe escura
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    min="0"
                                    required
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label className="cadastro-label">
                                Descrição:
                                <input
                                    type="text"
                                    className="cadastro-input-dark" // Usa a classe escura
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label className="cadastro-label">
                                Valor:
                                <input
                                    type="text"
                                    className="cadastro-input-dark" // Usa a classe escura
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    placeholder="0,00"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    {/* Tabela de Cadastrados (mantida) */}
                    <div className="tabela-container">
                        <table className="materiais-tabela">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                    <th>Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materiaisExistentes.map((mat, index) => (
                                    <tr key={index}>
                                        {/* Mapeia os dados usando os nomes do modelo do Backend */}
                                        <td>{mat.nome_material}</td>
                                        <td>{mat.quant_estoque}</td>
                                        <td>R$ {parseFloat(mat.valor_material).toFixed(2).replace('.', ',')}</td>
                                        <td>{mat.descricao_material}</td>
                                    </tr>
                                ))}
                                {/* Linhas vazias mantidas para visual */}
                                <tr><td colSpan="4" className="empty-row"></td></tr>
                                <tr><td colSpan="4" className="empty-row"></td></tr>
                                <tr><td colSpan="4" className="empty-row"></td></tr>
                                <tr><td colSpan="4" className="empty-row"></td></tr>
                                <tr><td colSpan="4" className="empty-row"></td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Botão Salvar */}
                    <div className="salvar-button-container">
                        <button
                            type="submit"
                            className="salvar-button"
                            disabled={carregando}
                        >
                            {carregando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>

                </form>
            </main>
            {/* Botão para voltar à Tela Inicial */}
            <button className="voltar-button" onClick={irParaInicial}>Voltar</button>
        </div>
    );
}

export default CadastroMateriais;