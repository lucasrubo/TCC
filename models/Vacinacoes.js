const Sequelize = require('sequelize');
const db = require('./db');
const Dogs = require('./Dogs');
const User = require('./User');

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
    data_vacina: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "dev"
    }
});

Vacinacoes.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
Vacinacoes.belongsTo(Dogs,{
    constraint: true,
    foreignKey: 'dog_id'
});
User.hasMany(Vacinacoes,{
    foreignKey: 'user_id'
});
Dogs.hasMany(Vacinacoes,{
    foreignKey: 'dog_id'
});
//Criar a tabela
// Vacinacoes.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinacoes.sync({ alter: true })

module.exports = Vacinacoes;