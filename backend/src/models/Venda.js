// backend/src/models/Venda.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Venda = sequelize.define(
  "Venda",
  {
    id_venda: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data_venda: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    // à vista / a prazo
    forma_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    // pago / pendente (NOT NULL no banco)
    status_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    // débito / crédito / dinheiro
    metodo_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    total_venda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "venda",
    timestamps: false,
  }
);

export default Venda;
