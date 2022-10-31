const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

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
    type:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "dog"
    }
});

Image.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
User.hasMany(Image,{
    foreignKey: 'user_id'
});
//Criar a tabela
//Image.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Image.sync({ alter: true ,force:true})

module.exports = Image;