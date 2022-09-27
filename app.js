const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const db = require('./models/db');

const path = require('path')

const { eAdmin } = require('./middlewares/auth');
const { getUser } = require('./middlewares/getUser');
const { promisify } = require('util');

const app = express();
const port = 8080;

// let’s you use the cookieParser in your application
app.use(cookieParser());

const generatePassword = async (password) => {
    return await new Promise((res, rej) => {
     // Your hash logic 
     bcrypt.hash(password, 10, (err, hash) => {
       if (err) rej(err);
       res(hash);
      });
    });
};

app.use(express.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', [  path.join(__dirname, './views'),
                    path.join(__dirname, './views/sistema/')]);

app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

app.get('/sistema', eAdmin, async (req, res) => {    
    res.redirect('back');
});

// index pages
app.get('/', getUser, async (req, res) => {
    if(req.userValues){
        // console.log(req.userValues);
        res.render('index',{'user_name' : req.userValues.name,'user_email':req.userValues.email});
    }else{
        // console.log('foi');
        res.render('index',{'user_name' : '','user_email':''});
    }
});
// Sobre page
app.get('/sobre', (req, res) => {
    res.render('sobre');
});
// contato page
app.get('/sistema/cadastro-usuario', eAdmin,getUser, (req, res) => {
    if(req.userValues){
        // console.log(req.userValues);
        res.render('cadastro-usuario',{'user_name' : req.userValues.name,'user_email':req.userValues.email});
    }else{
        // console.log('foi');
        res.render('cadastro-usuario',{'user_name' : '','user_email':''});
    }
});
// servico page
app.get('/servicos', (req, res) => {
    res.render('servicos');
});
// conta page
app.get('/conta', (req, res) => {
    res.render('conta');
});

app.post("/cadastrar-usuario-post", eAdmin, async (req, res) => {    
    const senha_criptografada = await generatePassword(req.body.senha)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: senha_criptografada
    }).then(function(){
        console.log("Usuário Cadastrado com sucesso")
        res.redirect('/sistema/cadastro-usuario');
    }).catch(function(erro){
        console.log("Erro: Usuário Não Cadastrado! " + erro)
        res.redirect('/sistema/cadastro-usuario');
    }) 
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.login_email
        }
    });

    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Nenhum usuário com este e-mail"
        });
    }
    
    if(!(await bcrypt.compare(req.body.login_senha, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!"
        });
    }

    var token = jwt.sign({id: user.id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        //expiresIn: 600 //10 min
        //expiresIn: 60 //1 min
        expiresIn: '7d' // 7 dia
    });
    res.cookie(`Authorization`,token);
    res.redirect('back');
});
app.post('/logout', (req, res) => {
    //show the saved cookies
    res.clearCookie('Authorization');
    res.redirect('/');
    res.end();
});
app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});