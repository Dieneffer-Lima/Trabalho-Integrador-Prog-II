// backend/src/services/UsuarioService.js

import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'; // Importa o modelo criado acima

class UsuarioService {

    // Função para encontrar um usuário pelo ID
    async buscarPorId(id_usuario) {
        return Usuario.findByPk(id_usuario);
    }

    // Função para encontrar um usuário pelo Email (usada no login)
    async buscarPorEmail(email) {
        return Usuario.findOne({ where: { email } });
    }

    // Função para criar um novo usuário (usada no cadastro - RF01)
    async criar({ nome_completo, email, senha, tipo_usuario }) {
        
        // 1. Verifica se o usuário já existe
        const usuarioExistente = await this.buscarPorEmail(email);
        if (usuarioExistente) {
            // Lança um erro que será capturado pelo AuthController
            const error = new Error("O e-mail informado já está em uso.");
            error.name = 'SequelizeUniqueConstraintError'; // Simula o erro do Sequelize
            throw error;
        }

        // 2. HASH da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        
        // 3. Cria o usuário no banco de dados com a senha hasheada
        const novoUsuario = await Usuario.create({
            nome_completo,
            email,
            senha: senhaHash,
            tipo_usuario
        });

        // 4. Retorna um objeto limpo (sem a senha hasheada)
        const { senha: _, ...usuarioSemSenha } = novoUsuario.toJSON();
        return usuarioSemSenha;
    }

    // Função para comparar a senha (usada no login)
    async compararSenha(senhaEnviada, senhaHash) {
        return bcrypt.compare(senhaEnviada, senhaHash);
    }
}

export default new UsuarioService();