const Sequelize = require('sequelize');
const db = require('./db');

const Vacinas = db.define('vacinas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    data_compra: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false
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
// Vacinas.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinas.sync({ alter: true })

module.exports = Vacinas;