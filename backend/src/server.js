// backend/src/server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import passport from "passport";
import "./config/passport.js"; // garante a estratégia jwt carregada

// --- Imports de Rotas ---
import authRoutes from "./routes/auth.routes.js";
import materialRoutes from "./routes/material.routes.js";
import estoqueRoutes from "./routes/estoque.routes.js";
import servicosRoutes from "./routes/servico.routes.js";
import despesasRoutes from "./routes/despesas.routes.js";
import vendasRoutes from "./routes/vendas.routes.js";
import notasFiscaisRoutes from "./routes/notasFiscais.routes.js";

import relatorioRouter from './routes/relatorio.routes.js'; 

dotenv.config();

// --- Criação do app e porta ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares globais ---
app.use(cors());
app.use(express.json()); // ler JSON no corpo das requisições
app.use(passport.initialize());

// --- Rotas protegidas / públicas ---
// auth (login/cadastro)
app.use("/api/auth", authRoutes);

// materiais / estoque / serviços / despesas / vendas
app.use("/api/materiais", materialRoutes);
app.use("/api/estoque", estoqueRoutes);
app.use("/api/servicos", servicosRoutes);
app.use("/api/despesas", despesasRoutes);
app.use("/api/venda", vendasRoutes);
app.use("/api/relatorios", relatorioRouter); 
app.use("/api/notas-fiscais", notasFiscaisRoutes);


app.get("/", (req, res) => {
    res.json({ message: "API da borracharia funcionando!" });
});

// --- Conectar no banco e subir servidor ---
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Conexão OK!");

        // Cria/sincroniza as tabelas conforme os models
        await sequelize.sync();
        console.log("Modelos sincronizados!");

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Erro ao iniciar o servidor ou conectar ao DB:", error);
    }
}

startServer();