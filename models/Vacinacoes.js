const Sequelize = require('sequelize');
const db = require('./db');

const Vacinacoes = db.define('vacinacoes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    vacina_id:{
        type: Sequelize.STRING,
        allowNull: false
    },
    dog_id:{
        type: Sequelize.STRING,
        allowNull: false
    },
    data_vacina: {
        type: Sequelize.DATEONLY,
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
        defaultValue: "dev"
    }
});

//Criar a tabela
// Vacinacoes.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinacoes.sync({ alter: true })

module.exports = Vacinacoes;