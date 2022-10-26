const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: true
    },
    data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    newsletter: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "off",
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Normal",
    },
    ativo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

//Criar a tabela
// User.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// User.sync({ alter: true});

module.exports = User;