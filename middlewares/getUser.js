const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const Image = require('../models/Images');

module.exports = {
    getUser: async function (req, res, next){        
        var token = req.cookies.Authorization;
        jwt.verify(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", function(err, decoded) {
            if (err) {
                console.log("Erro! "+err);
                res.clearCookie('Authorization');
                token = '';
            }            
          });
        if(token){  
            const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            // console.log(decode);
            const user = await User.findOne({
                attributes: ['username','name', 'email','type'],
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
            const getImg = await Image.findOne({
                attributes: ['id','image'],
                where: {
                    user_id: decode.id
                }
            });
            //console.log(user.dataValues);
            req.userValues = user.dataValues;
            if(getImg){
                req.userValues['imagem'] = getImg.image;
            }
            //console.log(req.userValues);
        }
        return next();
    }
}