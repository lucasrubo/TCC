const Sequelize = require('sequelize');
const db = require('./db');
const Animal = require('./Animais');
const User = require('./User');
const Vacinas = require('./Vacinas');

const Vacinacoes = db.define('vacinacoes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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

Vacinacoes.belongsTo(Vacinas,{
    constraint: true,
    foreignKey: 'vacinaId'
});
Vacinas.hasMany(Vacinacoes,{
    foreignKey: 'vacinaId'
});
//
Vacinacoes.belongsTo(User,{
    constraint: true,
    foreignKey: 'userId'
});
User.hasMany(Vacinacoes,{
    foreignKey: 'userId'
});
//
Vacinacoes.belongsTo(Animal,{
    constraint: true,
    foreignKey: 'animalId'
});
Animal.hasMany(Vacinacoes,{
    foreignKey: 'animalId'
});
//Criar a tabela
// Vacinacoes.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinacoes.sync({ alter: true })

module.exports = Vacinacoes;