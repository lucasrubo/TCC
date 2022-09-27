const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

module.exports = {
    logado: async function (req, res, next){
        const token = req.cookies.Authorization;
        try{
            if(!token){                  
                console.log("Erro: Necessário realizar o login para acessar a página! Faltam o token B!");
                req.userValues = '';                
                res.redirect('/');
                return next();  
            }else{
                const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
                const user = await User.findOne({
                    attributes: ['username','name', 'email','type'],
                    where: {
                        id: decode.id
                    }
                });
                req.userId = decode.id;
                req.userValues = user.dataValues;
                if(user.dataValues.type != "normal"){
                    return next();
                }else{
                    res.redirect('/');
                }
            }
        }catch(err){            
            console.log("Erro: Necessário realizar o login para acessar a página! Token inválido!");
            res.redirect('/');
        }
    }
}