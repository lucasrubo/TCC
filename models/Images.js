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
    }
});

//Criar a tabela
//Image.sync();

module.exports = Image;