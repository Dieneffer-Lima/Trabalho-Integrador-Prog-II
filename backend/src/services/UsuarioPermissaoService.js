import UsuarioPermissao from "../models/UsuarioPermissao.js";
import Permissao from "../models/Permissao.js";

const UsuarioPermissaoService = {
  async listarPermissoesDoUsuario(id_usuario) {
    return await UsuarioPermissao.findAll({
      where: { id_usuario },
      include: [{ model: Permissao, as: "permissao" }]
    });
  },

  async atribuirPermissao(id_usuario, id_permissao) {
    return await UsuarioPermissao.create({ id_usuario, id_permissao });
  },

  async removerPermissao(id_usuario, id_permissao) {
    const up = await UsuarioPermissao.findOne({
      where: { id_usuario, id_permissao }
    });

    if (!up) return false;

    await up.destroy();
    return true;
  }
};

export default UsuarioPermissaoService;
