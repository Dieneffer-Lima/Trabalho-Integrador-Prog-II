// backend/src/models/NotaFiscal.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Venda from "./Venda.js";

const NotaFiscal = sequelize.define(
  "NotaFiscal",
  {
    id_nota: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
   
    data_emissao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    data_prevista_pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    quantidade_servicos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_total_venda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pendente",   // 👈 padrão se não vier no body
    },
    id_venda: {
      type: DataTypes.INTEGER,
      allowNull: false,           // continua obrigatório
      references: {
        model: Venda,
        key: "id_venda",
      },
    },
  },
  {
    tableName: "nota_fiscal",
    timestamps: false,
  }
);

NotaFiscal.belongsTo(Venda, { foreignKey: "id_venda", as: "venda" });

export default NotaFiscal;
