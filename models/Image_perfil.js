const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./User');

const Image_perfil = db.define('images_perfil', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    image: {
        type: Sequelize.STRING
    }
});

Image_perfil.belongsTo(User,{
    constraint: true,
    foreignKey: 'user_id'
});
User.hasMany(Image_perfil,{
    foreignKey: 'user_id'
});
//Criar a tabela
//Image_perfil.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Image_perfil.sync({ alter: true ,force:true})

module.exports = Image_perfil;