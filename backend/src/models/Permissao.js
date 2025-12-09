// backend/src/models/Permissao.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Permissao = sequelize.define(
  "Permissao",
  {
    id_permissao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "permissao",
    timestamps: false
  }
);

export default Permissao;
