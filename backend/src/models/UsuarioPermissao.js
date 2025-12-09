// backend/src/models/UsuarioPermissao.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";
import Permissao from "./Permissao.js";

const UsuarioPermissao = sequelize.define(
  "UsuarioPermissao",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Usuario,
        key: "id_usuario"
      }
    },
    id_permissao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Permissao,
        key: "id_permissao"
      }
    }
  },
  {
    tableName: "usuario_permissao",
    timestamps: false
  }
);

export default UsuarioPermissao;
