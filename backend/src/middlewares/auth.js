import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import model from "../models/index.js"; // ou { Usuario, Permissao, UsuarioPermissao } etc

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "chave_super_secreta_da_borracharia"
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      // 🔥 Versão simples para o trabalho:
      // não vamos mais buscar no banco, vamos confiar no payload do token
      console.log("JWT payload recebido:", payload);
      return done(null, payload); // o req.user será o próprio payload
    } catch (error) {
      return done(error, false);
    }
  })
);
