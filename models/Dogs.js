const Sequelize = require('sequelize');
const db = require('./db');

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
        allowNull: false
    },
    latitute:{
        type: Sequelize.STRING,
        allowNull: true
    },
    longitude:{
        type: Sequelize.STRING,
        allowNull: true
    },
    user_id:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "1"
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
    }
});

//Criar a tabela
// Dogs.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Dogs.sync({ alter: true })

module.exports = Dogs;