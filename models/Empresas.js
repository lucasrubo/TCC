const Sequelize = require('sequelize');
const db = require('./db');

const Empresas = db.define('empresas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: true
    },
    ativo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

//Criar a tabela
// Empresas.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Empresas.sync({ alter: true })

module.exports = Empresas;