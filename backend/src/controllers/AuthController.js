// backend/src/controllers/AuthController.js

// Importa a biblioteca jwt para gerar tokens JWT (autenticação stateless)
import jwt from "jsonwebtoken";

// Importa o service de usuário, onde está a lógica de acesso ao banco (buscar/criar/comparar senha)
import UsuarioService from "../services/UsuarioService.js";

// Importa função que busca permissões do usuário (caso você use as tabelas Permissao/UsuarioPermissao)
import { obterPermissoesUsuario } from "../middlewares/permissoes.js";

const AuthController = {
  // Controller responsável pelo login (recebe email/senha, valida e devolve token + dados do usuário)
  async login(req, res) {
    try {
      // Extrai email e senha do corpo da requisição (enviado pelo frontend)
      const { email, senha } = req.body;

      // Log de depuração para conferir se o frontend está enviando os campos corretos
      console.log("LOGIN BODY:", req.body);

      // Busca o usuário pelo email no banco de dados
      const usuario = await UsuarioService.buscarPorEmail(email);

      // Valida se existe usuário e se a senha enviada bate com o hash salvo no banco
      // UsuarioService.compararSenha usa bcrypt.compare internamente
      if (!usuario || !(await UsuarioService.compararSenha(senha, usuario.senha))) {
        // Se falhar, retorna 401 (não autorizado) sem dizer exatamente qual campo está errado
        return res.status(401).json({ message: "E-mail ou senha inválidos." });
      }

      // Busca permissões do usuário (se usar permissão por tabela)
      // obterPermissoesUsuario retorna as permissões vinculadas ao usuário (join via UsuarioPermissao)
      const permissoesObj = await obterPermissoesUsuario(usuario.id_usuario);

      // Converte para um array só com descrições (ex.: ["ADMIN", "ESTOQUE"])
      const permissoes = permissoesObj.map((p) => p.descricao);

      // Gera o token JWT com dados básicos do usuário no payload
      // O payload será usado depois na validação do token (passport-jwt)
      const token = jwt.sign(
        {
          // Identificador do usuário para amarrar requisições ao usuário autenticado
          id_usuario: usuario.id_usuario,
          email: usuario.email,

          // Permissões:
          // - se existirem permissões cadastradas, usa elas
          // - se não existirem, cai para o tipo_usuario do usuário (ADMIN/OPERADOR)
          permissoes: permissoes.length > 0 ? permissoes : [usuario.tipo_usuario.toUpperCase()],
        },
        // Segredo de assinatura do token
        process.env.JWT_SECRET || "chaveda_borracharia",
        // Tempo de expiração do token (depois disso o usuário precisa logar de novo)
        { expiresIn: "8h" }
      );

      // Monta o objeto de resposta do usuário s
      const usuarioResposta = {
        id_usuario: usuario.id_usuario,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
        permissoes,
      };

      // Retorna para o frontend: token + dados do usuário
      return res.json({ token, usuario: usuarioResposta });
    } catch (error) {
      // Se der erro inesperado (banco fora, bug, etc.), retorna 500
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  // Controller responsável pelo cadastro (register) de usuários
  async register(req, res) {
    try {
      // req.body já vem do frontend com nome_completo, email, senha, tipo_usuario
      // A validação mais forte e hash de senha acontecem dentro do UsuarioService.criar
      const novoUsuario = await UsuarioService.criar(req.body);

      // Retorna 201 (Created) com o usuário criado (sem senha)
      return res.status(201).json(novoUsuario);
    } catch (error) {
      // Loga o erro para depuração
      console.error("Erro ao registrar novo usuário:", error);

      // Se o email já existir, retorna 409 (Conflict)
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.message.includes("e-mail informado já está em uso")
      ) {
        return res.status(409).json({ message: "O e-mail informado já está em uso." });
      }

      // Erro genérico
      return res.status(500).json({ message: "Erro interno ao tentar cadastrar o usuário." });
    }
  },
};

export default AuthController;
