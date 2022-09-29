const bcrypt = require('bcrypt');
var fs = require('fs');

module.exports = {
    //Convertendo binario em arquivo
    base64_decode: function (base64str,fileName){
        var bitmap = new Buffer (base64str, 'base64');
        fs.writeFileSync('src/temp/'+fileName+'',bitmap, 'binary', function (err){
            if(err){
            console.log('Conversao com erro');
            }
        } );
    },
    //Convertendo arquivo em binário
    base64_encode : function (fileName){
        var bitmap = fs.readFileSync('src/temp/'+fileName+'');
        return new Buffer (bitmap).toString('base64');
    },
    //Gera a senha
    generatePassword: async function (password){
        return await new Promise((res, rej) => {
            // Your hash logic 
            bcrypt.hash(password, 10, (err, hash) => {
            if (err) rej(err);
            res(hash);
            });
        });
    },
};