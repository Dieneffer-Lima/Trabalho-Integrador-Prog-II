// backend/src/models/Material.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Material = sequelize.define('Material', {
    id_material: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_material: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descricao_material: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    valor_material: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quant_estoque: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        // 🛑 CORRIGIDO: Removido o comentário de citação que estava causando o SyntaxError
        defaultValue: 0 
    },
}, {
    tableName: 'material', 
    timestamps: false 
});

export default Material;