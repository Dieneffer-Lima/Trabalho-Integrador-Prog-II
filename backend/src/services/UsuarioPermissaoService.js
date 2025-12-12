// backend/src/services/UsuarioPermissaoService.js

// Importa o model de associação UsuarioPermissao (tabela que liga usuário e permissão)
import UsuarioPermissao from "../models/UsuarioPermissao.js";
// Importa o model Permissao para trazer detalhes da permissão junto com a associação
import Permissao from "../models/Permissao.js";

const UsuarioPermissaoService = {
  // Lista permissões associadas a um usuário específico
  // Retorna registros da tabela UsuarioPermissao e inclui os dados da tabela Permissao
  async listarPermissoesDoUsuario(id_usuario) {
    // SELECT * FROM usuario_permissao
    // WHERE id_usuario = :id_usuario
    // JOIN permissao ON permissao.id_permissao = usuario_permissao.id_permissao;
    return await UsuarioPermissao.findAll({
      where: { id_usuario },
      // include faz o Sequelize trazer também o registro da tabela Permissao relacionado
      include: [{ model: Permissao, as: "permissao" }],
    });
  },

  // Cria uma associação entre um usuário e uma permissão
  // Normalmente usada quando se quer conceder acesso a determinada funcionalidade
  async atribuirPermissao(id_usuario, id_permissao) {
    // INSERT INTO usuario_permissao (id_usuario, id_permissao) VALUES (:id_usuario, :id_permissao);
    return await UsuarioPermissao.create({ id_usuario, id_permissao });
  },

  // Remove uma associação entre um usuário e uma permissão
  // Primeiro busca a linha específica e depois deleta
  async removerPermissao(id_usuario, id_permissao) {
    // SELECT * FROM usuario_permissao WHERE id_usuario = :id_usuario AND id_permissao = :id_permissao LIMIT 1;
    const up = await UsuarioPermissao.findOne({
      where: { id_usuario, id_permissao },
    });

    // Se não existir associação, retorna false para o controller tratar como "nada para remover"
    if (!up) return false;

    // DELETE FROM usuario_permissao WHERE id_usuario = :id_usuario AND id_permissao = :id_permissao;
    await up.destroy();

    // Indica que removeu com sucesso
    return true;
  },
};

export default UsuarioPermissaoService;

