// backend/src/models/Despesa.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Despesa = sequelize.define(
  "Despesa",
  {
    id_despesa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao_despesa: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    valor_despesa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data_despesa: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "despesa", // <-- NOME DA TABELA NO POSTGRES
    timestamps: false,
  }
);

export default Despesa;
