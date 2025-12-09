// backend/src/controllers/AuthController.js (FINAL)

import jwt from "jsonwebtoken";
import UsuarioService from "../services/UsuarioService.js"; 
import { obterPermissoesUsuario } from "../middlewares/permissoes.js"; // Se você usa permissões

const AuthController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      console.log("LOGIN BODY:", req.body);

      const usuario = await UsuarioService.buscarPorEmail(email);

      // 1. Verifica se o usuário existe e se a senha está correta
      if (!usuario || !(await UsuarioService.compararSenha(senha, usuario.senha))) {
        return res.status(401).json({ message: "E-mail ou senha inválidos." });
      }

      // 2. Obtém as permissões do usuário
      // Se você não usa tabela de Permissões/UsuarioPermissao, pode simplificar esta parte
      // Usando o tipo_usuario diretamente (como string)
      const permissoesObj = await obterPermissoesUsuario(usuario.id_usuario);
      const permissoes = permissoesObj.map(p => p.descricao); // Ex: ['ADMIN', 'ESTOQUE']

      // 3. Gera o token JWT
      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          email: usuario.email,
          permissoes: permissoes.length > 0 ? permissoes : [usuario.tipo_usuario.toUpperCase()]
        },
        process.env.JWT_SECRET || "chave_super_secreta_da_borracharia",
        { expiresIn: "8h" }
      );

      // 4. Retorna dados do usuário e token
      const usuarioResposta = {
        id_usuario: usuario.id_usuario,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario, // Adicionado o tipo de usuário
        permissoes
      };

      return res.json({ token, usuario: usuarioResposta });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  },
  
  // MÉTODO COMPLETO PARA CADASTRO (RF01)
  async register(req, res) {
    try {
      // O req.body já contém nome_completo, email, senha, tipo_usuario do frontend.
      const novoUsuario = await UsuarioService.criar(req.body); 

      // Retorna 201 Created
      return res.status(201).json(novoUsuario);

    } catch (error) {
      console.error("Erro ao registrar novo usuário:", error);
      
      // Captura o erro de e-mail duplicado
      if (error.name === 'SequelizeUniqueConstraintError' || error.message.includes("e-mail informado já está em uso")) {
        return res.status(409).json({ message: "O e-mail informado já está em uso." });
      }

      return res.status(500).json({ message: "Erro interno ao tentar cadastrar o usuário." });
    }
  }
};

export default AuthController;