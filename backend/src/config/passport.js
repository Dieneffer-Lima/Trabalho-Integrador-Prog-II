// backend/src/config/passport.js
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Usuario } from "../models/index.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "chave_super_secreta_da_borracharia"
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const usuario = await Usuario.findByPk(jwtPayload.id_usuario);

      if (!usuario) {
        return done(null, false);
      }

      // usuário autenticado disponível em req.user
      return done(null, usuario);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
