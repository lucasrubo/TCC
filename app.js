const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const generatePassword = async (password) => {
    return await new Promise((res, rej) => {
     // Your hash logic 
     bcrypt.hash(password, 10, (err, hash) => {
       if (err) rej(err);
       res(hash);
      });
    });
};
async function passCheck(event) {
    var fromDB = await pool.query('SELECT password from User WHERE email  = ? Limit 1', event.emailID);
    // --------------------------------------------------------------------------^
    // Added limit 1 to make sure the only one record will be returned.
    if (fromDB.length > 0 && await bcrypt.compare(event.password, fromDB[0].password)) {
      //Here i am comparing
      console.log('valid');
    } else {
      console.log('invalid');
    }
  }

const app = express();
const port = 8080;

app.use(express.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

// index pages
app.get('/', (req, res) => {
    res.render('index');
});
// Sobre page
app.get('/sobre', (req, res) => {
    res.render('sobre');
});
// contato page
app.get('/cadastro-usuario', (req, res) => {
    res.render('cadastro-usuario');
});
// servico page
app.get('/servicos', (req, res) => {
    res.render('servicos');
});
// conta page
app.get('/conta', (req, res) => {
    res.render('conta');
});

app.post("/cadastrar-usuario-post", async function(req, res){
    const senha_criptografada = await generatePassword(req.body.senha)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: senha_criptografada
    }).then(function(){
        console.log("Usuário Cadastrado com sucesso")
        res.redirect('cadastro-usuario');
    }).catch(function(erro){
        console.log("Erro: Usuário Não Cadastrado! " + erro)
        res.redirect('cadastro-usuario');
    })
});

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});