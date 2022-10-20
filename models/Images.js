const Sequelize = require('sequelize');
const db = require('./db');

const Image = db.define('images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    image: {
        type: Sequelize.STRING
    },
    user_id:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "dog"
    }
});

//Criar a tabela
//Image.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
Image.sync({ alter: true })

module.exports = Image;
