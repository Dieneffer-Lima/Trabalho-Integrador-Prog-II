// backend/src/middlewares/permissoes.js

// Importa o passport para usar a estratégia JWT configurada no projeto
import passport from "passport";

// Importa os models Permissao e UsuarioPermissao para consultar permissões no banco
import { Permissao, UsuarioPermissao } from "../models/index.js";

// Middleware pronto do passport para exigir autenticação via JWT
// Ele valida o token Bearer e, se estiver ok, coloca o payload em req.user
export const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Função utilitária: verifica se um usuário possui uma permissão, buscando a permissão pela descrição
// Retorna true/false; não envia resposta HTTP (isso quem faz o middleware)
export const verificarPermissaoPorDescricao = async (
  id_usuario,
  descricaoPermissao
) => {
  try {
    // Procura no banco a permissão cujo campo "descricao" é igual ao texto informado
    // Exemplo: SELECT * FROM permissao WHERE descricao = :descricaoPermissao LIMIT 1;
    const permissao = await Permissao.findOne({
      where: { descricao: descricaoPermissao },
    });

    // Se a permissão não existir cadastrada, o usuário não pode ter ela
    if (!permissao) {
      return false;
    }

    // Verifica na tabela de junção se existe um vínculo (usuario, permissao)
    // Exemplo: SELECT * FROM usuario_permissao WHERE id_usuario = :id_usuario AND id_permissao = :id_permissao LIMIT 1;
    const usuarioPermissao = await UsuarioPermissao.findOne({
      where: {
        id_usuario: id_usuario,
        id_permissao: permissao.id_permissao,
      },
    });

    // Se achou registro, tem permissão; se não achou, não tem
    return usuarioPermissao !== null;
  } catch (error) {
    // Em caso de falha de banco ou qualquer erro, registra no console e retorna false por segurança
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
};

// Função utilitária: devolve a lista de permissões do usuário (objetos Permissao)
// Útil para telas/rotas que precisam listar o que o usuário pode acessar
export const obterPermissoesUsuario = async (id_usuario) => {
  try {
    // Busca todos os vínculos do usuário na tabela UsuarioPermissao
    // e traz junto (include) o objeto Permissao relacionado
    const permissoesUsuario = await UsuarioPermissao.findAll({
      where: { id_usuario },
      include: [
        {
          model: Permissao,
          as: "permissao",
        },
      ],
    });

    // Converte o resultado (vínculos) em um array apenas com as permissões
    // Ex.: [Permissao, Permissao, ...]
    return permissoesUsuario.map((up) => up.permissao);
  } catch (error) {
    // Se der erro, retorna lista vazia para não quebrar o fluxo de quem chamou
    console.error("Erro ao obter permissões do usuário:", error);
    return [];
  }
};

// Middleware gerador: cria um middleware que verifica uma permissão específica
// Deve ser usado após requireJWTAuth, pois depende de req.user existir
export const verificarPermissaoMiddleware = (descricaoPermissao) => {
  // Retorna a função middleware de fato (req, res, next)
  return async (req, res, next) => {
    try {
      // Se não existe req.user, significa que o JWT não foi validado (ou não foi aplicado antes)
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      // O id do usuário vem do payload do JWT (ver config/passport.js)
      const id_usuario = req.user.id_usuario;

      // Checa no banco se esse usuário possui a permissão indicada por descrição
      const temPermissao = await verificarPermissaoPorDescricao(
        id_usuario,
        descricaoPermissao
      );

      // Se não tiver, bloqueia com 403 (proibido)
      if (!temPermissao) {
        return res.status(403).json({
          message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`,
        });
      }

      // Se tiver permissão, libera a rota
      next();
    } catch (error) {
      // Erros inesperados viram 500
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  };
};

// junta autenticação JWT + verificação de permissão em um único export
export const requirePermissao = (descricaoPermissao) => {
  // Retorna um array de middlewares, executados em sequência pelo Express
  return [requireJWTAuth, verificarPermissaoMiddleware(descricaoPermissao)];
};
