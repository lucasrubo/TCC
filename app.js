const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { promisify } = require('util');
var fs = require('fs');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Image = require('./models/Images');
const db = require('./models/db');

const path = require('path')

const { logado } = require('./middlewares/auth');
const func = require('./models/functions');
const { getUser } = require('./middlewares/getUser');
const uploadUser  = require('./middlewares/uploadImage');

const app = express();
const port = 8080;

// let’s you use the cookieParser in your application
app.use(cookieParser());

app.use(express.json());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', [  path.join(__dirname, './views'),
                    path.join(__dirname, './views/sistema/'),
                    path.join(__dirname, './views/usuario/')]);

app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

// index pages
app.get('/', getUser, async (req, res) => {
    if(req.userValues){
        // console.log(req.userValues);
        res.render('index',{'userValues' : req.userValues});
    }else{
        // console.log('foi');
        res.render('index',{'userValues' : ''});
    }
});

// # Relacionado Conta
app.get('/usuario/perfil',getUser, async (req, res) => {
    if(req.userValues){
        // console.log(req.userValues);
        res.render('perfil',{'userValues' : req.userValues});
    }else{
        // console.log('foi');
        res.redirect('/')
    }
});
app.post('/usuario/upload-image', uploadUser.single('avatar'), async (req, res) => {   
    if (req.file) {
        //console.log(req.file);
        const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
        
        const check_id = await Image.findOne({
            attributes: ['id','image'],
            where: {
                user_id: decode.id
            }
        });
        const old_image = check_id.image;
        await Image.upsert({
            id: check_id.id,
            image: req.file.filename,
            user_id: decode.id
        })
        .then(() => {
            fs.unlink('public/upload/'+old_image, (err) => {
                if (err) {
                    console.error(err)
                    return
                }                  
                //file removed
                });
            return res.json({
                erro: false,
                mensagem: "Update realizado com sucesso!"
            });
        }).catch(() => {
            fs.unlink('public/upload/'+req.file.filename, (err) => {
                if (err) {
                    console.error(err)
                    return
                }                  
                //file removed
                });
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Update não realizado com sucesso!"
            });
        });
    }
});
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            username: req.body.login_username
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
// #! Relacionado Conta

// # Sistema
app.get('/sistema', async (req, res) => {    
    res.redirect('back');
});
// ## usuários

// ### Cadastrar
app.get('/sistema/cadastro-usuario', logado, (req, res) => {
    if(req.userValues.type == 'admin'){
        // console.log(req.userValues);
        res.render('cadastro-usuario',{'userValues' : req.userValues});
    }else{
        console.log('Você não tem acesso');
        res.redirect('/');
    }    
});
app.post("/sistema/cadastrar-usuario-post", logado, async (req, res) => {    
    if(req.userValues.type=='admin'){
        const senha_criptografada = await func.generatePassword(req.body.senha)
        User.create({
            type: req.body.type,
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: senha_criptografada
        }).then(function(){
            console.log("Usuário Cadastrado com sucesso");
            res.redirect('/sistema/cadastro-usuario');
        }).catch(function(erro){
            console.log("Erro: Usuário Não Cadastrado! " + erro);
            res.redirect('/sistema/cadastro-usuario');
        }) 
    }else{
        res.redirect('../');
    }
});
// ###! Cadastrar

// listar
app.get('/sistema/listar-usuarios', logado, async (req, res) => {    
    const user = await User.findAll();
    //console.log(user.dataValues)
    res.render('listar-usuarios',{'userValues' : req.userValues,'lista_usuarios':user});      
});
// ##! usuários
// #! Sistema

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});