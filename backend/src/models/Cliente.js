import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    tableName: "cliente",
    timestamps: false
  }
);

export default Cliente;
