const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const Image_perfil = require('../models/Image_perfil');

module.exports = {
    logado: async function (req, res, next){
        var token = req.cookies.Authorization;  
        try{       
            if(token){   
                jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", function(err, decoded) {
                    if (err) {
                        console.log(err);       
                        res.clearCookie('Authorization');        
                        res.redirect('/?msg=Token-expirado');
                        token = '';
                        return false;
                    }            
                });
                const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
                const user = await User.findOne({
                    attributes: ['username','name', 'email','type','empresa','cpf','data_nascimento','newsletter','ativo'],
                    where: {
                        id: decode.id
                    }
                });
                if(user.dataValues.ativo == 0){
                    res.clearCookie('Authorization');         
                    res.redirect('/?msg=Usuario-precisar-estar-ativado');
                    token = '';
                    return false;
                }
                req.userId = decode.id;
                req.userValues = user.dataValues;
                        
                const getImg = await Image_perfil.findOne({
                    attributes: ['id','image'],
                    where: {
                        user_id: decode.id
                    }
                });
                if(getImg){
                    req.userValues['imagem'] = getImg.image;
                }
                if(user.dataValues.type != "normal"){
                    return next();
                }else{
                    res.redirect('/?msg=Acesso-Negado');
                }
            
            }else{     
                req.userValues = [{
                    username: '',
                    name: '',
                    email: '',
                    type: '',
                    empresa: '',
                    cpf: '',
                    data_nascimento: '',
                    newsletter: '',
                    ativo: 0
                  }];
            
                console.log(err);            
                token = '';
                console.log("Erro: Necessário realizar o login para acessar a página! Faltam o token B!");
                res.clearCookie('Authorization');   
                res.redirect('/?msg=Erro:-Precisa-estar-Logado');
                return next();  
            }
        }catch(err){            
            console.log("Erro: Necessário realizar o login para acessar a página! Token inválido!"+ err);
                 
            res.redirect('/?msg=Precisa-estar-logado');
            return false;
        }
    }
}