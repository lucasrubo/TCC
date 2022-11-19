const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Vacinas = db.define('vacinas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "dev"
    }
});

Vacinas.belongsTo(User,{
    constraint: true,
    foreignKey: 'userId'
});
User.hasMany(Vacinas,{
    foreignKey: 'userId'
});
//Criar a tabela
// Vacinas.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Vacinas.sync({ alter: true ,force:true})

module.exports = Vacinas;