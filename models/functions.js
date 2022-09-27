const bcrypt = require('bcrypt');

module.exports = {
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