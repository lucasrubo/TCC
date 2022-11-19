const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const Image_perfil = require('../models/Image_perfil');

module.exports = {
    getUser: async function (req, res, next){        
        var token = req.cookies.Authorization;
        if(token){  
            jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", function(err, decoded) {
                if (err) {
                    console.log("Erro! "+err);
                    res.clearCookie('Authorization');
                    token = '';
                }            
            });
            const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            // console.log(decode);
            const user = await User.findOne({
                attributes: ['username','name', 'email','type','empresa','cpf','data_nascimento','newsletter','ativo'],
                where: {
                    id: decode.id
                }
            });
            if(user === null){
                req.userValues = [{
                    username: null,
                    name: null,
                    email: null,
                    type: null,
                    empresa: null,
                    cpf: null,
                    data_nascimento: null,
                    newsletter: null,
                    ativo: 0
                  }];
                return next();
            }     
            if(user.dataValues.ativo == 0){
                res.clearCookie('Authorization');            
                res.redirect('/?msg=msg=Usuario-precisar-estar-ativado');
                token = '';
            }         
            const getImg = await Image_perfil.findOne({
                attributes: ['id','image'],
                where: {
                    userId: decode.id
                }
            });
            // console.log(user.dataValues);
            req.userValues = user.dataValues;
            if(getImg){
                req.userValues['imagem'] = getImg.image;
            }
            //console.log(req.userValues);
        }else{
            req.userValues = [{
                username: null,
                name: null,
                email: null,
                type: null,
                empresa: null,
                cpf: null,
                data_nascimento: null,
                newsletter: null,
                ativo: 0
              }];
        }
        return next();
    }
}