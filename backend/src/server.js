// backend/src/server.js

import express from "express"; // Framework web para criar rotas e servidor HTTP
import dotenv from "dotenv"; // Carrega variáveis de ambiente a partir de um arquivo .env
import cors from "cors"; // Middleware para permitir requisições do frontend (domínios diferentes)
import sequelize from "./config/database.js"; // Instância/configuração do Sequelize para conexão com o banco
import passport from "passport"; // Biblioteca para autenticação (aqui usada com JWT)
import "./config/passport.js"; // Importa o arquivo que configura a estratégia JWT do passport

// Importa os módulos de rotas (cada um separa as rotas por responsabilidade do sistema)
import authRoutes from "./routes/auth.routes.js"; // Rotas de login e cadastro
import materialRoutes from "./routes/material.routes.js"; // Rotas CRUD de materiais
import estoqueRoutes from "./routes/estoque.routes.js"; // Rotas relacionadas a entrada/controle de estoque
import servicosRoutes from "./routes/servico.routes.js"; // Rotas CRUD de serviços
import despesasRoutes from "./routes/despesas.routes.js"; // Rotas CRUD de despesas
import vendasRoutes from "./routes/vendas.routes.js"; // Rotas para registrar e listar vendas
import notasFiscaisRoutes from "./routes/notasFiscais.routes.js"; // Rotas para cadastro/listagem de notas fiscais
import relatorioRouter from "./routes/relatorio.routes.js"; // Rotas para relatórios (ex.: vendas brutas)

dotenv.config(); // Carrega as variáveis do .env para process.env

// Cria a aplicação Express
const app = express();

// Define a porta do servidor (prioriza a variável do ambiente; se não existir, usa 3001)
const PORT = process.env.PORT || 3001;

// Middlewares globais: executam antes das rotas
app.use(cors()); // Permite o frontend acessar a API (evita bloqueios de CORS no navegador)
app.use(express.json()); // Habilita leitura de JSON no body das requisições (req.body)
app.use(passport.initialize()); // Inicializa o passport (necessário para autenticação JWT nas rotas)

// Define os caminhos base das rotas da API
app.use("/api/auth", authRoutes); // /api/auth/login, /api/auth/register, etc.
app.use("/api/materiais", materialRoutes); // /api/materiais (GET/POST/PUT/DELETE)
app.use("/api/estoque", estoqueRoutes); // /api/estoque/entrada, etc.
app.use("/api/servicos", servicosRoutes); // /api/servicos (GET/POST/PUT/DELETE)
app.use("/api/despesas", despesasRoutes); // /api/despesas (GET/POST/PUT/DELETE)
app.use("/api/venda", vendasRoutes); // /api/venda (registrar venda, etc.)
app.use("/api/relatorios", relatorioRouter); // /api/relatorios/vendas/bruto, etc.
app.use("/api/notas-fiscais", notasFiscaisRoutes); // /api/notas-fiscais (POST, GET, ...)

// Rota simples para testar se o servidor está no ar
app.get("/", (req, res) => {
  res.json({ message: "API da borracharia funcionando!" });
});

// Função que inicia o servidor garantindo que a conexão com o banco está funcionando
async function startServer() {
  try {
    // Testa a autenticação/conexão com o banco
    await sequelize.authenticate();
    console.log("Conexão OK!");

    // Cria ou sincroniza tabelas no banco com base nos models do Sequelize
    // Se alterarem models, isso pode criar/alterar estruturas conforme a configuração do Sequelize
    await sequelize.sync();
    console.log("Modelos sincronizados!");

    // Sobe o servidor HTTP na porta definida
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    // Caso não conecte no banco ou dê erro no sync, o servidor não sobe
    console.error("Erro ao iniciar o servidor ou conectar ao DB:", error);
  }
}

// Executa a inicialização
startServer();
