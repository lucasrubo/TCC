const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
    eAdmin: async function (req, res, next){
        const token = req.cookies.Authorization;
        if(!token){                  
            res.redirect('/');      
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Faltam o token B!"
            });
        }
        try{
            const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            req.userId = decode.id;
            return next();
        }catch(err){            
            res.redirect('/');
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Token inválido!"
            });
        }
    }
}