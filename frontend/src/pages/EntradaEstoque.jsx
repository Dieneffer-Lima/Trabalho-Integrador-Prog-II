// frontend/src/pages/EntradaEstoque.jsx (INTEGRAÇÃO COM BACKEND REAL)

// Importa o React e os hooks: useState (estado local) e useEffect (executa ações ao montar o componente)
import React, { useState, useEffect } from 'react';
// Importa a instância do Axios já configurada (baseURL, interceptors, etc.)
import api from '../api';
// Importa o CSS específico da tela de entrada de estoque
import '../styles/entradaEstoque.css';

// Componente responsável por registrar entradas de materiais no estoque
// Recebe por props a função de navegação para voltar ao Controle de Estoque
function EntradaEstoque({ irParaControleEstoque }) {

    // Armazena o id do material selecionado no <select>
    const [materialId, setMaterialId] = useState('');
    // Armazena a quantidade digitada pelo usuário para adicionar ao estoque
    const [quantidade, setQuantidade] = useState('');
    // Mensagem de feedback para o usuário (sucesso/erro)
    const [mensagem, setMensagem] = useState(null);
    // Lista de materiais carregados do backend para preencher o <select>
    const [materiais, setMateriais] = useState([]);
    // Controla estado de carregamento durante a busca inicial de materiais
    const [isLoading, setIsLoading] = useState(true);

    // Efeito executado uma vez ao abrir a tela para carregar os materiais existentes do banco
    useEffect(() => {
        // Função assíncrona que consulta o backend e atualiza o estado "materiais"
        const fetchMateriais = async () => {
            // Ativa loading e limpa mensagens anteriores
            setIsLoading(true);
            setMensagem(null);

            try {
                // Requisição GET para listar materiais cadastrados
                const response = await api.get('/materiais');

                // Converte os dados do backend para um formato mais simples usado pela tela
                const dadosMateriais = response.data.map(item => ({
                    id: item.id_material,
                    nome: item.nome_material,
                    quantidade: item.quant_estoque, // Valor atual do estoque para exibir no select
                }));

                // Salva a lista no estado para renderizar as opções do select
                setMateriais(dadosMateriais);

            } catch (err) {
                // Se a chamada falhar, registra no console para debug
                console.error('Erro ao buscar materiais:', err);
                // Exibe uma mensagem amigável para o usuário
                setMensagem({ type: 'error', text: 'Erro ao carregar lista de materiais. Verifique o backend.' });
            } finally {
                // Desativa o loading independentemente de sucesso/erro
                setIsLoading(false);
            }
        };

        // Executa a função ao montar o componente
        fetchMateriais();
    }, []);

    // Função do submit do formulário: registra uma entrada no estoque via backend
    const handleSubmit = async (e) => {
        // Evita o comportamento padrão do form (recarregar a página)
        e.preventDefault();

        // Limpa mensagem anterior antes de validar e enviar
        setMensagem(null);

        // Converte string para número inteiro para validação e envio ao backend
        const quantidadeAdicionar = parseInt(quantidade);

        // Valida se um material foi selecionado e se a quantidade é válida (> 0 e numérica)
        if (!materialId || quantidadeAdicionar <= 0 || isNaN(quantidadeAdicionar)) {
            setMensagem({ type: 'error', text: 'Selecione um material e informe uma quantidade válida.' });
            return;
        }

        // Localiza o material selecionado na lista (para usar o nome na mensagem de sucesso)
        const materialSelecionado = materiais.find(m => m.id === parseInt(materialId));

        try {
            // Monta o corpo da requisição que será enviado ao backend
            const payload = {
                id_material: parseInt(materialId),
                quantidade: quantidadeAdicionar,
                // Campos extras poderiam ser adicionados aqui (id_usuario, data, etc.)
            };

            // Requisição POST para o endpoint de entrada de estoque
            // A lógica de somar a quantidade e atualizar "quant_estoque" deve estar no backend
            await api.post('/estoque/entrada', payload);

            // Se a requisição der certo, exibe mensagem de sucesso para o usuário
            setMensagem({
                type: 'success',
                text: `Entrada de ${quantidadeAdicionar} unidades de ${materialSelecionado.nome} registrada com sucesso no banco de dados!`
            });

            // Limpa os campos do formulário para um novo lançamento
            setMaterialId('');
            setQuantidade('');

        } catch (err) {
            // Se falhar, registra no console para identificar o erro e/ou retorno do backend
            console.error('Erro ao registrar entrada de estoque:', err);
            // Mensagem amigável para indicar que o endpoint ou backend precisa ser verificado
            setMensagem({
                type: 'error',
                text: 'Falha ao registrar entrada. Verifique o console e o endpoint POST /estoque/entrada no seu backend.'
            });
        }
    };

    // Renderização da tela e do formulário de entrada de estoque
    return (
        <div className="entrada-estoque-page">
            <div className="main-content-entrada">

                {/* Cabeçalho da página */}
                <header className="entrada-header">
                    <h1 className="entrada-title">Adicionar Produto ao Estoque</h1>
                </header>

                {/* Botão que volta para a tela anterior (Controle de Estoque) */}
                <button className="voltar-button" onClick={irParaControleEstoque}>
                    Voltar
                </button>

                {/* Formulário responsável por enviar a entrada de estoque */}
                <form onSubmit={handleSubmit} className="entrada-form">

                    {/* Mensagens de feedback (sucesso/erro) */}
                    {mensagem && (
                        <div className={`mensagem ${mensagem.type}`}>
                            {mensagem.text}
                        </div>
                    )}

                    {/* Campo de seleção do material */}
                    <div className="form-group">
                        <label htmlFor="material">Selecione o Material:</label>

                        {/* Enquanto carrega materiais do backend, mostra texto de carregamento */}
                        {isLoading ? (
                            <p>Carregando materiais do banco de dados...</p>
                        ) : (
                            // Select controlado por estado (materialId)
                            <select
                                id="material"
                                value={materialId}
                                // Ao trocar o material, atualiza o estado e limpa mensagens
                                onChange={(e) => { setMaterialId(e.target.value); setMensagem(null); }}
                                required
                            >
                                <option value="">-- Selecione um material --</option>

                                {/* Renderiza as opções do select com base na lista carregada do backend */}
                                {materiais.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.nome} (Estoque atual: {material.quantidade})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Campo de quantidade para adicionar ao estoque */}
                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade a Adicionar:</label>
                        <input
                            type="number"
                            id="quantidade"
                            value={quantidade}
                            // Atualiza o estado conforme o usuário digita e limpa mensagens
                            onChange={(e) => { setQuantidade(e.target.value); setMensagem(null); }}
                            min="1"
                            placeholder="Ex: 50"
                            required
                        />
                    </div>

                    {/* Botão que envia o formulário */}
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

// Exporta o componente para ser usado no App.jsx
export default EntradaEstoque;
