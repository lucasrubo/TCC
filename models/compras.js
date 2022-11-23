const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');
const Vacinas = require('./Vacinas');

const Compras = db.define('compras', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    obs:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    qtd: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    custo: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
    },
    estoque_antes: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Normal"
    }
});

Compras.belongsTo(Vacinas,{
    constraint: true,
    foreignKey: 'vacinaId'
});
Vacinas.hasMany(Compras,{
    foreignKey: 'vacinaId'
});
Compras.belongsTo(User,{
    constraint: true,
    foreignKey: 'userId'
});
User.hasMany(Compras,{
    foreignKey: 'userId'
});
//Criar a tabela
// Animais.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Compras.sync({ alter: true})

module.exports = Compras;