// backend/src/middlewares/permissoes.js
import passport from "passport";
import { Permissao, UsuarioPermissao } from "../models/index.js";

// Middleware para autenticação JWT (igual ao template)
export const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Função para verificar se um usuário tem uma permissão específica por descrição
export const verificarPermissaoPorDescricao = async (id_usuario, descricaoPermissao) => {
  try {
    const permissao = await Permissao.findOne({
      where: { descricao: descricaoPermissao }
    });

    if (!permissao) {
      return false;
    }

    const usuarioPermissao = await UsuarioPermissao.findOne({
      where: {
        id_usuario: id_usuario,
        id_permissao: permissao.id_permissao
      }
    });

    return usuarioPermissao !== null;
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
};

// Função para obter todas as permissões de um usuário
export const obterPermissoesUsuario = async (id_usuario) => {
  try {
    const permissoesUsuario = await UsuarioPermissao.findAll({
      where: { id_usuario },
      include: [
        {
          model: Permissao,
          as: "permissao"
        }
      ]
    });

    return permissoesUsuario.map((up) => up.permissao);
  } catch (error) {
    console.error("Erro ao obter permissões do usuário:", error);
    return [];
  }
};

// Middleware reutilizável para verificar permissão específica
// Deve ser usado APÓS o requireJWTAuth
export const verificarPermissaoMiddleware = (descricaoPermissao) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      const id_usuario = req.user.id_usuario;
      const temPermissao = await verificarPermissaoPorDescricao(
        id_usuario,
        descricaoPermissao
      );

      if (!temPermissao) {
        return res.status(403).json({
          message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`
        });
      }

      next();
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  };
};

// Middleware "combão" para JWT + permissão
export const requirePermissao = (descricaoPermissao) => {
  return [
    requireJWTAuth,
    verificarPermissaoMiddleware(descricaoPermissao)
  ];
};
