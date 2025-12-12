// backend/src/config/passport.js

// Importa o passport, que gerencia estratégias de autenticação no Express
import passport from "passport";

// Importa a estratégia JWT e o extrator de token do header Authorization
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// Importa o model Usuario (do index.js de models) para buscar o usuário no banco
import { Usuario } from "../models/index.js";

// Configurações JWT:
// - onde o token será lido
// - oq sera usado para validar a assinatura do token
const opts = {
  // Lê o token do header: Authorization: Bearer <token>
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  // Usa JWT_SECRET do .env
  secretOrKey: process.env.JWT_SECRET || "chave_da_borracharia",
};

// Registra a estratégia JWT no passport
passport.use(
  // JwtStrategy recebe as opções e uma função chamada quando o token é válido
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      // jwtPayload é o conteúdo do token decodificado (payload)
      // Aqui esperamos que o payload tenha id_usuario
      const usuario = await Usuario.findByPk(jwtPayload.id_usuario);

      // Se não encontrar o usuário no banco, falha a autenticação
      if (!usuario) {
        return done(null, false);
      }

      // Se encontrou, o usuário fica disponível em req.user nas rotas protegidas
      return done(null, usuario);
    } catch (err) {
      // Se ocorreu erro interno (banco fora, etc.), retorna erro para o passport
      return done(err, false);
    }
  })
);

// Exporta o passport 
export default passport;
