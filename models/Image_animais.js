const Sequelize = require('sequelize');
const db = require('./db');
const Dogs = require('./Animais');

const Image_animais = db.define('images_animais', {
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

Image_animais.belongsTo(Dogs,{
    constraint: true,
    foreignKey: 'animal_id'
});
Dogs.hasMany(Image_animais,{
    foreignKey: 'animal_id'
});
//Criar a tabela
//Image_animais.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Image_animais.sync({ alter: true ,force:true})

module.exports = Image_animais;