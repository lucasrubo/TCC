const express = require('express');
const { Op } = require('sequelize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { promisify } = require('util');
const fs = require('fs');
const sharp = require('sharp');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Image = require('./models/Images');
const Dogs = require('./models/Dogs');
const db = require('./models/db');

const func = require('./models/functions');
const path = require('path');

const { logado } = require('./middlewares/auth');
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
                user_id: decode.id,
                type: "perfil"
            }
        });
        if(!check_id){
            var last_id = await Image.findAll({
                attributes: ['id'],
                order: [
                    ['id', 'DESC'],
                ]
            });
        }
        var newfilepath= 'public/upload/'+req.file.filename;
        var filepath= 'public/upload/antes_redimensionar/'+req.file.filename;      

        var image_id = 0;
        var old_image = "";
        if(check_id){
            image_id = check_id.id;
            old_image = check_id.image;
        }else{
            image_id = parseInt(last_id.id + 1);
        }
        await Image.upsert({
            id: image_id,
            image: req.file.filename,
            user_id: decode.id,
            type: "perfil"
        })
        .then(() => {
            sharp(filepath)
            .resize({width:225})
            .jpeg({ mozjpeg: true })
            .toFile(`${newfilepath}`)
            .then( data => { 
                console.log("foi: ");
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }                  
                    //file removed
                });
            })
            .catch( err => { 
                console.log(err);
            });
            console.log(old_image+' Arquivo enviado')
            if(old_image != ""){
                fs.unlink('public/upload/'+old_image, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }                  
                    //file removed
                });
            }
        }).catch(() => {
            console.log('Arquivo não enviado')
            fs.unlink('public/upload/'+req.file.filename, (err) => {
                if (err) {
                    console.error(err)
                    return
                }                  
                //file removed
            });
        });
        res.redirect('/usuario/perfil');
    }
});
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            [Op.or]: [
                {username: req.body.login_username},
                {email: req.body.login_username}
            ]
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
    var Expira = 600; //10 min
    if(req.body.manterLogado){
        Expira = '7d';
    }
    var token = jwt.sign({id: user.id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        expiresIn: Expira 
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
app.get('/sistema', logado, async (req, res) => {    
    res.render('sistema',{'userValues' : req.userValues});
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
    for(var i = 0; user.length>i;i++){
        const getImage = await Image.findOne({
            attributes: ['id','image'],
            where: {
                user_id: user[i].id,
                type: "perfil"
            }
        });        
        if(getImage){
            user[i]['imagem'] = getImage.image;
        }
    }
    res.render('listar-usuarios',{'userValues' : req.userValues,'lista_usuarios':user});      
});
app.post("/sistema/att-usuario-post", logado, async (req, res) => {    
    if(req.userValues.type=='admin'){     
        await User.update(
            { name: req.body.model_name,
            username: req.body.model_username,
            email: req.body.model_email,
            type: req.body.model_level,
            updatedAt: req.body.model_att_now },
            { where: { id: req.body.model_id } }
          )
        .then(() => {           
            console.log('Atualizado')
            res.redirect('/sistema/listar-usuarios');
        }).catch((err) => {
            console.log('Erro ao atualizar:'+ err)
            res.redirect('/sistema/listar-usuarios');
        });
    }else{
        res.redirect('../');
    }
});
// ##! usuários

// ## Cachorros

// ### Cadastrar
app.get('/sistema/cadastro-cachorro', logado, (req, res) => {
    res.render('cadastro-cachorro',{'userValues' : req.userValues});  
});
app.post("/sistema/cadastro-cachorro-post", logado, async (req, res) => {  
    // User.create({
    //     type: req.body.type,
    //     username: req.body.username,
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: senha_criptografada
    // }).then(function(){
    //     console.log("Usuário Cadastrado com sucesso");
    //     res.redirect('/sistema/cadastro-usuario');
    // }).catch(function(erro){
    //     console.log("Erro: Usuário Não Cadastrado! " + erro);
    //     res.redirect('/sistema/cadastro-usuario');
    // }) 
});
// ###! Cadastrar

// listar
app.get('/sistema/listar-cachorros', logado, async (req, res) => {   
    const dog = await Dogs.findAll();
    for(var i = 0; dog.length>i;i++){
        const getImage = await Image.findOne({
            attributes: ['id','image'],
            where: {
                user_id: dog[i].id,
                type: "dog"
            }
        });        
        if(getImage){
            dog[i]['imagem'] = getImage.image;
        }
    }
    res.render('listar-cachorros',{'userValues' : req.userValues,'lista':dog});      
});
// ##! Cachorros

// #! Sistema

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});