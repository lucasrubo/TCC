const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Dogs = db.define('dogs', {
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

Dogs.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
User.hasMany(Dogs,{
    foreignKey: 'user_id'
});
//Criar a tabela
// Dogs.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Dogs.sync({ alter: true})

module.exports = Dogs;