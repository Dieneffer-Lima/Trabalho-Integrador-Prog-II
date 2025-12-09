// backend/src/models/Usuario.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Importa a instância do Sequelize

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome_completo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true // Garante que e-mails são únicos
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tipo_usuario: { 
        type: DataTypes.ENUM('Administrador', 'Operador de Caixa'),
        allowNull: false
    }
}, {
    tableName: 'usuario', 
    timestamps: false 
});

export default Usuario;