const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

module.exports = {
    getUser: async function (req, res, next){
        if(req.cookies.Authorization){  
            const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            // console.log(decode);
            const user = await User.findOne({
                attributes: ['name', 'email'],
                where: {
                    id: decode.id
                }
            });
            if(user === null){
                return res.status(400).json({
                    erro: true,
                    mensagem: "Erro: Precisa logar"
                });
            }  
            //console.log(user.dataValues);
            req.userValues = user.dataValues;
        }
        return next();
    }
}