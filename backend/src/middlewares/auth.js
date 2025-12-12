// backend/src/config/passport.js

// Importa o passport, que gerencia estratégias de autenticação
import passport from "passport";

// Importa a estratégia JWT e o extrator do token no header Authorization
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";


// Opções JWT:
// - de onde extrair o token
// - qual segredo usar para validar a assinatura do token
const opts = {
  // Lê o token do header: Authorization: Bearer <token>
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  // Mesma chave usada para assinar o token no login (AuthController/Service)
  secretOrKey: process.env.JWT_SECRET || "chave_super_secreta_da_borracharia",
};

// Registra no passport uma estratégia JWT com as opções definidas
passport.use(
  // Quando um token válido chegar, o passport decodifica o payload e chama esta função
  new JwtStrategy(opts, async (payload, done) => {
    try {
      // validação é simplificada:
      // não consulta o banco; confia no payload do token
      // O objeto retornado aqui vira o req.user nas rotas protegidas
      console.log("JWT payload recebido:", payload);

      // done(null, payload) indica "autenticado com sucesso" e define req.user = payload
      return done(null, payload);
    } catch (error) {
      // done(error, false) indica falha de autenticação por erro interno
      return done(error, false);
    }
  })
);
