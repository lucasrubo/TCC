const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Animais = db.define('animais', {
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
    raça:{
        type: Sequelize.STRING,
        allowNull: true
    },
    obs:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    latitude:{
        type: Sequelize.STRING,
        allowNull: true
    },
    longitude:{
        type: Sequelize.STRING,
        allowNull: true
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Normal"
    },
    ativo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    tipo:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Animais.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
User.hasMany(Animais,{
    foreignKey: 'user_id'
});
//Criar a tabela
// Animais.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Animais.sync({ alter: true})

module.exports = Animais;