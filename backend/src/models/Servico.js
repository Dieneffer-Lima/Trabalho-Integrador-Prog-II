import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Servico = sequelize.define(
  "Servico",
  {
    id_servico: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome_servico: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valor_servico: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    tableName: "servico",
    timestamps: false
  }
);

export default Servico;
