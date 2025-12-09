// backend/src/models/ItemVenda.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemVenda = sequelize.define(
  "ItemVenda",
  {
    id_item_venda: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_venda: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_servico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade_servico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor_unitario_servico: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "item_venda",
    timestamps: false,
  }
);

export default ItemVenda;

