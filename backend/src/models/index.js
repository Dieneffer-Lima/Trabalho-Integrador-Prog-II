import sequelize from "../config/database.js";

import Usuario from "./Usuario.js";
import Cliente from "./Cliente.js";
import Material from "./Material.js";
import Servico from "./Servico.js";
import Venda from "./Venda.js";
import Despesa from "./Despesa.js";
import NotaFiscal from "./NotaFiscal.js";
import ItemVenda from "./ItemVenda.js";
import Permissao from "./Permissao.js";
import UsuarioPermissao from "./UsuarioPermissao.js";

/* RELACIONAMENTOS DO SISTEMA*/

// Usuario 1:N Venda
Usuario.hasMany(Venda, { foreignKey: "id_usuario" });
Venda.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Cliente 1:N Venda
Cliente.hasMany(Venda, { foreignKey: "id_cliente" });
Venda.belongsTo(Cliente, { foreignKey: "id_cliente" });

// Usuario 1:N Despesa
Usuario.hasMany(Despesa, { foreignKey: "id_usuario" });
Despesa.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Venda 1:1 Nota Fiscal
Venda.hasOne(NotaFiscal, { foreignKey: "id_venda" });
NotaFiscal.belongsTo(Venda, { foreignKey: "id_venda" });

// Venda 1:N ItemVenda
Venda.hasMany(ItemVenda, { foreignKey: "id_venda" });
ItemVenda.belongsTo(Venda, { foreignKey: "id_venda" });

// Material 1:N ItemVenda
Material.hasMany(ItemVenda, { foreignKey: "id_material" });
ItemVenda.belongsTo(Material, { foreignKey: "id_material" });

// Servico 1:N ItemVenda
Servico.hasMany(ItemVenda, { foreignKey: "id_servico" });
ItemVenda.belongsTo(Servico, { foreignKey: "id_servico" });

// Usuario N:N Permissao
Usuario.belongsToMany(Permissao, {
  through: UsuarioPermissao,
  foreignKey: "id_usuario",
  otherKey: "id_permissao"
});

Permissao.belongsToMany(Usuario, {
  through: UsuarioPermissao,
  foreignKey: "id_permissao",
  otherKey: "id_usuario"
});

async function startDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexão OK!");

    await sequelize.sync();
    console.log("Models sincronizados!");
  } catch (error) {
    console.error("Erro ao sincronizar:", error);
  }
}

startDatabase();

export {
  Usuario,
  Cliente,
  Material,
  Servico,
  Venda,
  Despesa,
  NotaFiscal,
  ItemVenda,
  Permissao,
  UsuarioPermissao
};
