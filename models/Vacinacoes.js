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
    foreignKey: 'vacina_id'
});
Vacinas.hasMany(Vacinacoes,{
    foreignKey: 'vacina_id'
});
//
Vacinacoes.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
User.hasMany(Vacinacoes,{
    foreignKey: 'user_id'
});
//
Vacinacoes.belongsTo(Animal,{
    constraint: true,
    foreignKey: 'animal_id'
});
Animal.hasMany(Vacinacoes,{
    foreignKey: 'animal_id'
});
//Criar a tabela
// Vacinacoes.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinacoes.sync({ alter: true })

module.exports = Vacinacoes;