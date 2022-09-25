const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const db = require('./models/db');

const path = require('path')

const { eAdmin } = require('./middlewares/auth');
const { response } = require('express');

const app = express();
const port = 8080;

const generatePassword = async (password) => {
    return await new Promise((res, rej) => {
     // Your hash logic 
     bcrypt.hash(password, 10, (err, hash) => {
       if (err) rej(err);
       res(hash);
      });
    });
};

//testando 
function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    const index = blacklist.findIndex(item=> item === token);
    if(index !== -1) return res.status(401).end();
    jwt.verify(token,"D62ST92Y7A6V7K5C6W9ZU6W8KS3",(err,decoded) => {
        if(err) return res.status(401).end();

        req.uderId = decoded.userId;
        next();
    })
}
//testando

app.use(express.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', [  path.join(__dirname, './views'),
                    path.join(__dirname, './views/sistema/')]);

app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

app.get('/sistema', eAdmin, async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email'],
        order: [['id', "DESC"]]
    })
    .then((users) => {
        return res.json({
            erro: false,
            users,
            id_usuario_logado: req.userId
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    });    
});

// index pages
app.get('/', (req, res) => {
    res.render('index');
});
// Sobre page
app.get('/sobre', (req, res) => {
    res.render('sobre');
});
// contato page
app.get('/sistema/cadastro-usuario', (req, res) => {
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

app.post("/cadastrar-usuario-post", async (req, res) => {    
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
        res.redirect('sistema/cadastro-usuario');
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
    res.set({'Authorization': 'Bearer '+token});
    res.render('index');
    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
});
const blacklist = [];
app.post('/logout', (req, res) => {
    blacklist.push(req.headers['authorization']);
    res.end();
});
app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});