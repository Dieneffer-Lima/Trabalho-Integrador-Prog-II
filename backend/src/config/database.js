// backend/src/config/database.js

// Importa a classe Sequelize.  conectar e executar operações no banco
import { Sequelize } from "sequelize";

// Importa dotenv para ler variáveis do arquivo .env e colocar em process.env
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env (DB_NAME, DB_USER, DB_PASS, DB_HOST, etc.)
dotenv.config();

// Cria a instância principal do Sequelize com as credenciais do banco
// Essa instância será reutilizada pelos models e pelo server para autenticar/sincronizar
const sequelize = new Sequelize(
  process.env.DB_NAME, // nome do banco (ex.: borracharia_db)
  process.env.DB_USER, // usuário do banco (ex.: postgres)
  process.env.DB_PASS, // senha do banco (ex.: postgres)
  {
    // endereço do servidor do banco; se não vier no .env, assume localhost
    host: process.env.DB_HOST || "localhost",

    // define o tipo de banco que o Sequelize vai usar
    dialect: "postgres",

    // desliga logs SQL no console para não poluir a saída
    logging: false,
  }
);

// Exporta a instância para ser usada em server.js e nos models
export default sequelize;
