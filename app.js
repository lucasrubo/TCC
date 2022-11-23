const express = require('express');
const { Op } = require('sequelize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { promisify } = require('util');
const fs = require('fs');
const sharp = require('sharp');

const https = require('https');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Banco de dados
const User = require('./models/User');
const Image_perfil = require('./models/Image_perfil');
const Image_animais = require('./models/Image_animais');
const Animais = require('./models/Animais');
const Vacinas = require('./models/Vacinas');
const Vacinacoes = require('./models/Vacinacoes');
const Compras = require('./models/compras');
const db = require('./models/db');
// db.sync({ alter: true,force:true});

const func = require('./models/functions');
const path = require('path');

const { logado } = require('./middlewares/auth');
const { getUser } = require('./middlewares/getUser');
const uploadUser  = require('./middlewares/uploadImage');
const { exit } = require('process');

const app = express();
const port = 8080;

let date_ob = new Date();
// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// current year
let year = date_ob.getFullYear();
// current hours
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
// current seconds
let seconds = date_ob.getSeconds();

// let’s you use the cookieParser in your application
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', [  path.join(__dirname, './views'),
                    path.join(__dirname, './views/sistema/'),
                    path.join(__dirname, './views/usuario/')]);
// index pages
app.get('/', getUser, async (req, res) => {
    if(!req.userValues){
        req.userValues = "";
    }
    res.render('index',{'userValues' : req.userValues});
});
app.get('/mapa', getUser, async (req, res) => {
    if(!req.userValues){
        req.userValues = "";
    }    
    var vacinacoes = [];
    var animal = await Animais.findAll({            
        where: {
            ativo: 1
        }
    });
    if(animal){
        for(var i = 0; animal.length>i;i++){
            const getImage = await Image_animais.findOne({
                attributes: ['id','image'],
                where: {
                    animalId: animal[i].id
                }
            });      
            const getUser_animal = await User.findOne({
                attributes: ['id','name','email'],
                where: {
                    id: animal[i].userId
                }
            });   
            const getVacinacoes = await Vacinacoes.findAll({          
                raw:true,  
                where: {
                    animalId: animal[i].id
                },                
                include: Vacinas
            });     
            if(getImage){
                animal[i]['imagem'] = getImage.image;
            }        
            if(getUser_animal){
                animal[i]['usuario'] = getUser_animal.name;
            }
            if(getVacinacoes){
                for(var a = 0; getVacinacoes.length>a;a++){
                    vacinacoes.push(getVacinacoes[a]);
                }
            }
        }    
    }
    res.render('mapa',{'userValues' : req.userValues,'lista':animal,'vacinacoes':vacinacoes});      
});
app.post('/email-contato', async (req, res) => {
    var name_p = req.body.name;
    var email_p = req.body.email;
    var tel_p = req.body.tel;
    var tipo_p = req.body.tipo;
    var msg_p = req.body.msg;

    var titulo = "Contato: "+name_p;
    var mensagem = "<b>Nome:</b> "+name_p+"<br><b>E-mail:</b> "+email_p+"<br><b>Telefone:</b> "+tel_p+"<br><b>Tipo de contato:</b> "+tipo_p+"<br><b>Mensagem:</b> "+msg_p;

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "1551d051b21b35",
          pass: "35a1d7d2beba9e"
        }
      });
      var message = {
        from: "norelpay@tcc.com.br",
        to: "flvvw.2019@gmail.com",
        subject: titulo,
        text: msg_p,
        html: mensagem
      };
      transport.sendMail(message,function (err){
        if(err){
            res.redirect('/?msg=Erro:-Erro-ao-enviar');
            return false;
        }
        res.redirect('/?msg=Enviado-com-Sucesso');
        return true;
      });
});

// # Relacionado Conta
app.get('/usuario/perfil',getUser, async (req, res) => {
    if(req.userValues.username){
        // console.log(req.userValues);
        res.render('perfil',{'userValues' : req.userValues});
    }else{
        // console.log('foi');
        res.redirect('/?msg=Erro:-Precisa-estar-logado');
    }
});
app.post('/usuario/upload-image', uploadUser.single('avatar'), async (req, res) => {   
    var nascimento = req.body.nascimento;
    if(!nascimento){
        nascimento = null;
    }
    var decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
    if (req.file) {
        //console.log(req.file);
        
        const check_id = await Image_perfil.findOne({
            attributes: ['id','image'],
            where: {
                userId: decode.id
            }
        });
        if(!check_id){
            var last_id = await Image_perfil.findAll({
                attributes: ['id'],
                order: [
                    ['id', 'DESC'],
                ],
                limit: 1
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
        await Image_perfil.upsert({
            id: image_id,
            image: req.file.filename,
            userId: decode.id
        })
        .then(() => {
            sharp(filepath)
            .resize({width:225})
            .jpeg({ mozjpeg: true })
            .toFile(`${newfilepath}`)
            .then( data => { 
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
    }    
    var newsletter_s = req.body.newsletter;
    if(!newsletter_s){
        newsletter_s = "off";
    }
    await User.update(
        { 
        name: req.body.name,
        email: req.body.email,
        cpf: req.body.cpf,
        data_nascimento: nascimento,
        newsletter: newsletter_s,        
        updatedAt: year + "-" + month + "-" + date
        },
        { where: { id: decode.id } }
      )
    .then(() => {           
        console.log('Atualizado')
    }).catch((err) => {
        console.log('Erro ao atualizar:'+ err)
    });
    if(req.body.senha){
        const senha_criptografada = await func.generatePassword(req.body.senha);
        await User.update(
            { 
            password: senha_criptografada,
            },
            { where: { id: decode.id } }
          )
        .then(() => {           
            console.log('Atualizado')
        }).catch((err) => {
            console.log('Erro ao atualizar:'+ err)
        });
    }
    res.redirect('/usuario/perfil?msg=Atualizado-com-Sucesso');
});
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            [Op.or]: [
                {username: req.body.login_username},
                {email: req.body.login_username}
            ],
            ativo: 1
        }
    });
    if(user === null){
        res.redirect('/?msg=Erro:-Usuario-ou-a-senha-incorretas-!Usuario-inexistente');
        return false;
    }    
    if(!(await bcrypt.compare(req.body.login_senha, user.password))){
        res.redirect('/?msg=Erro:-Usuario-ou-a-senha-incorretas');
        return false;
    }
    var Expira = 600; //10 min
    if(req.body.manterLogado){
        Expira = '7d';
    }
    var token = jwt.sign({id: user.id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        expiresIn: Expira 
    });
    res.cookie(`Authorization`,token);
    res.redirect('/?msg=Logado-com-Sucesso');
    return true;
});
app.get('/logout', (req, res) => {
    //show the saved cookies
    res.clearCookie('Authorization');
    res.redirect('/?msg=Deslogado-com-Sucesso');
    res.end();
});
// #! Relacionado Conta

// # Sistema
app.get('/sistema', logado, async (req, res) => {    
    res.render('sistema',{'userValues' : req.userValues});
});
// ## usuários
// ### Cadastrar
app.get('/cadastro-usuario-normal', getUser, (req, res) => {
    if(!req.userValues){
        req.userValues = "";
    }
    res.render('cadastro-usuario-normal',{'userValues' : req.userValues}); 
});
app.get('/sistema/cadastro-usuario', logado, (req, res) => {
    if(req.userValues.type == 'admin'){
        // console.log(req.userValues);
        res.render('cadastro-usuario',{'userValues' : req.userValues});
    }else{
        console.log('Você não tem acesso');
        res.redirect('/?msg=Erro:-Acesso-Negado');
    }    
});
app.post("/sistema/cadastrar-usuario-post",getUser, async (req, res) => {    
    const senha_criptografada = await func.generatePassword(req.body.senha);
    var empresa_post = req.userValues.empresa;
    var user_type = req.userValues.type;
    var nascimento = req.body.nascimento;
    var name_p = req.body.name;
    var cpf_p = req.body.cpf;
    var newsletter_p = req.body.newsletter;
    if(req.body.empresa){
        empresa_post = req.body.empresa;
    }else if(!empresa_post){
        empresa_post = "normal";
    }
    if(req.body.type){
        user_type = req.body.type;
    }else if(!user_type){
        user_type = "normal";
    }
    if(!nascimento){
        nascimento = null;
    }
    if(!name_p){
        name_p = null;
    }
    if(!cpf_p){
        cpf_p = null;
    }
    if(!newsletter_p){
        newsletter_p = "off";
    }
    User.create({
        type: user_type,
        username: req.body.username,
        name: name_p,
        email: req.body.email,
        password: senha_criptografada,
        empresa: empresa_post,
        data_nascimento: nascimento,
        cpf: cpf_p,
        newsletter: newsletter_p,
        ativo: 0
    }).then(function(){
        console.log("Usuário Cadastrado com sucesso");
    }).catch(function(erro){
        console.log("Erro: Usuário Não Cadastrado! " + erro);
        if(req.body.retornarLista == 1){
            res.redirect('/sistema/usuarios?msg=Erro:-Nao-Cadastrado!');
            return;
        }else{
            res.redirect('/sistema/cadastro-usuario?msg=Erro:-Nao-Cadastrado!');
            return;
        }
    });
    if(!empresa_post){
        res.redirect('/?msg='+msg_notif+'...-Aguarde-a-Aprovação');
        return;
    }else{
        if(req.body.retornarLista == 1){
            res.redirect('/sistema/usuarios?msg=Cadastrado-com-sucesso');
            return;
        }else{
            res.redirect('/sistema/cadastro-usuario?msg=Cadastrado-com-sucesso');
            return;
        }
    }
});
// ###! Cadastrar

// listar
app.get('/sistema/usuarios', logado, async (req, res) => {   
    if(req.userValues.empresa == 'dev'){        
        var user = await User.findAll();
    }else{
        var user = await User.findAll({            
            where: {
                empresa: req.userValues.empresa
            }
        });
    }
    for(var i = 0; user.length>i;i++){
        const getImage = await Image_perfil.findOne({
            attributes: ['id','image'],
            where: {
                userId: user[i].id
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
            { 
            name: req.body.model_name,
            email: req.body.model_email,
            type: req.body.model_level,
            ativo: req.body.statusUsuario
            },
            { where: { id: req.body.model_id } }
          )
        .then(() => {           
            console.log('Atualizado')
            res.redirect('/sistema/usuarios?msg=Atualizado-com-Sucesso');
        }).catch((err) => {
            console.log('Erro ao atualizar:'+ err)
            res.redirect('/sistema/usuarios?msg=Erro:-Problema-ao-Atualizar');
        });
    }else{
        res.redirect('/sistema/usuarios?msg=Erro:-Sem-acesso');
    }
});
app.post('/sistema/deletar-usuarios', logado, async (req, res) => {   
    if(req.userValues.type == 'admin'){
        if(req.body.id_delete != ''){   
            var count = 
            User.findAll({ where: { id: req.body.id_delete }})
            .then(() => {  
                User.destroy({ where: { id: req.body.id_delete }});         
                console.log('Deletado');
                console.log(`deleted row(s): ${count}`);
                res.redirect('/sistema/usuarios?msg=Deletado-com-sucesso');    
                return true;
            }).catch((err) => {
                console.log('Erro ao deletar:'+ err);
                res.redirect('/sistema/usuarios?msg=Erro:-Problema-ao-Deletar');  
                return false;  
            });
        }
    }else{
        res.redirect('/sistema/usuarios?msg=Erro:-Sem-permissao');  
    }
});
// ##! usuários

// ## vacinas
// # listar
app.get('/sistema/vacinas', logado, async (req, res) => {   
    if(req.userValues.empresa == 'dev'){        
        var vacinas = await Vacinas.findAll();
    }else{
        var vacinas = await Vacinas.findAll({            
            where: {
                empresa: req.userValues.empresa
            }
        });
    }
    res.render('listar-vacinas',{'userValues' : req.userValues,'lista':vacinas});      
});
app.post("/sistema/cadastrar-vacina-post",logado, async (req, res) => {        
    var nome_post = req.body.nome;
    var estoque_post = req.body.estoque;
    var empresa_user = req.userValues.empresa;
    const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
    var id = decode.id; 
    if(!empresa_user){
        empresa_user = "normal";
    }
    if(!estoque_post){
        estoque_post = 0;
    }
    Vacinas.create({
        nome:nome_post,
        empresa: empresa_user,
        estoque: estoque_post,
        userId: id
    }).then(function(){
        console.log("Cadastrado com sucesso");
        res.redirect('/sistema/vacinas?msg=Cadastrado-com-sucesso');
        return;
    }).catch(function(erro){
        console.log("Erro: Não Cadastrado! " + erro);
        res.redirect('/sistema/vacinas?msg=Erro:-Nao-Cadastrado!');
        return;
    });
    
});
app.post("/sistema/att-vacina-post", logado, async (req, res) => { 
        const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
        var id = decode.id; 
        await Vacinas.update(
            { 
                nome: req.body.model_name,
                estoque: req.body.model_estoque,
                userId: id
            },
            { where: { id: req.body.model_id } }
          )
        .then(async () =>  {           
            console.log('Atualizado')
            res.redirect('/sistema/vacinas?msg=Atualizado-com-Sucesso');
        }).catch((err) => {
            console.log('Erro ao atualizar:'+ err)
            res.redirect('/sistema/vacinas?msg=Erro:-Problema-ao-Atualizar');
        });
});
app.post('/sistema/deletar-vacinas', logado, async (req, res) => {   
    if(req.userValues.type == 'admin'){
        if(req.body.id_delete != ''){   
            var count = await Vacinas.destroy({ where: { id: req.body.id_delete } })
            .then(() => {           
                console.log('Deletado');
                console.log(`deleted row(s): ${count}`);
                res.redirect('/sistema/vacinas?msg=Deletado-com-sucesso');    
                return true;
            }).catch((err) => {
                console.log('Erro ao deletar:'+ err);
                res.redirect('/sistema/vacinas?msg=Erro:-Problema-ao-Deletetar');  
                return false;  
            });
        }
    }
});
// #! listar
// # compras
app.get('/sistema/lancar-compra-vacina', logado, async (req, res) => { 
    if(req.userValues.empresa == 'dev'){    
        var compras = await Compras.findAll({        
            raw:true,               
            include: Vacinas
        });
        var vacinas = await Vacinas.findAll();    
    }else{
        var compras = await Compras.findAll({       
            raw:true,                
            where: {
                empresa: req.userValues.empresa
            },               
            include: Vacinas
        });
        var vacinas = await Vacinas.findAll({            
            where: {
                empresa: req.userValues.empresa
            }
        });
    }
    res.render('lancar-compra-vacina',{'userValues' : req.userValues,'lista':compras,'lista_vacinas':vacinas});      
});
app.post('/sistema/cadastrar-compra-post', logado, async (req, res) => {        
    var nome_post = req.body.nome;
    var qtd_post = req.body.qtd;
    var obs_post = req.body.obs;    
    var custo_post = (req.body.custo).replace('.','');
    custo_post = custo_post.replace(',','.');
    var empresa_user = req.userValues.empresa;
    const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
    var id = decode.id; 
    if(!empresa_user){
        empresa_user = "normal";
    }
    if(!qtd_post){
        qtd_post = 0;
    }
    var vacinas = await Vacinas.findAll({        
        raw:true,             
        where: {
            id: nome_post
        }
    });
    var estoque_antes = vacinas[0].estoque;
    var estoque_atual = parseFloat(estoque_antes) + parseFloat(qtd_post);
    await Vacinas.update( { 
            estoque: estoque_atual
        },
        { where: { id: nome_post } 
    });
    Compras.create({
        nome:nome_post,
        qtd: qtd_post,
        custo: custo_post,
        obs: obs_post,
        estoque_antes: estoque_antes,
        empresa: empresa_user,
        vacinaId: nome_post,
        userId: id
    }).then(function(){
        console.log("Cadastrado com sucesso");
        res.redirect('/sistema/lancar-compra-vacina?msg=Cadastrado-com-sucesso');
        return;
    }).catch(function(erro){
        console.log("Erro: Não Cadastrado! " + erro);
        res.redirect('/sistema/lancar-compra-vacina?msg=Erro:-Nao-Cadastrado!');
        return;
    });
      
});
app.post('/sistema/att-compra-post', logado, async (req, res) => {        
    var model_id = req.body.model_id;      
    var qtd_post = req.body.qtd;
    var obs_post = req.body.obs;    
    var custo_post = (req.body.custo).replace('.','');
    custo_post = custo_post.replace(',','.');
    const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
    var id = decode.id; 
    if(!qtd_post){
        qtd_post = 0;
    }
    Compras.update({
        qtd: qtd_post,
        custo: custo_post,
        obs: obs_post,
        vacinaId: nome_post,
        userId: id
    },{ where: { id: model_id } }).then(function(){
        console.log("Atualizado com sucesso");
        res.redirect('/sistema/lancar-compra-vacina?msg=Atualizado-com-sucesso');
        return;
    }).catch(function(erro){
        console.log("Erro: Não Atualizado! " + erro);
        res.redirect('/sistema/lancar-compra-vacina?msg=Erro:-Nao-Atualizado!');
        return;
    });
      
});
app.post('/sistema/deletar-compras', logado, async (req, res) => {   
    if(req.userValues.type == 'admin'){
        if(req.body.id_delete != ''){   
            var compras = await Compras.findAll({        
                raw:true,             
                where: {
                    id: req.body.id_delete
                }
            });
            await Vacinas.update( { 
                    estoque: compras[0].estoque_antes
                },
                { where: { id: compras[0].vacinaId } 
            });
            var count = await Compras.destroy({ where: { id: req.body.id_delete } })
            .then(() => {           
                console.log('Deletado');
                console.log(`deleted row(s): ${count}`);
                res.redirect('/sistema/lancar-compra-vacina?msg=Deletado-com-sucesso');    
                return true;
            }).catch((err) => {
                console.log('Erro ao deletar:'+ err);
                res.redirect('/sistema/lancar-compra-vacina?msg=Erro:-Problema-ao-Deletetar');  
                return false;  
            });
        }
    }
});
// #! compras
// ##! vacinas

app.get('/sistema/relatorio', logado, async (req, res) => {   
    if(req.userValues.empresa == 'dev'){        
        var vacinas = await Vacinas.findAll();
    }else{
        var vacinas = await Vacinas.findAll({            
            where: {
                empresa: req.userValues.empresa
            }
        });
    }
    res.render('relatorio',{'userValues' : req.userValues,'lista':vacinas});      
});

// ## animais

// ### Cadastrar
app.get('/sistema/cadastro-animais', logado, (req, res) => {
    res.render('cadastro-animais',{'userValues' : req.userValues});  
});
app.post("/sistema/cadastro-animais-post", logado, uploadUser.single('foto'), async (req, res) => { 
    
    if (req.file) { 
        var msg_erro="";
        const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
        var id = decode.id; 
        var tipo_form = req.body.animalTipo;
        if(tipo_form == "Outro"){
            tipo_form = req.body.OutroSubmit;
        }
        Animais.create({
            nome: req.body.name,
            raça: req.body.raca,
            latitude: req.body.latitude_form,
            longitude: req.body.longitude_form,
            userId: id,
            empresa: req.userValues.empresa,
            obs: req.body.obs_dog,
            tipo: tipo_form
        }).then(async function(){
            console.log("animal Cadastrado com sucesso");
            msg_erro = "?msg=Cadastrado-com-sucesso";
            var newfilepath= 'public/upload/'+req.file.filename;
            var filepath= 'public/upload/antes_redimensionar/'+req.file.filename;  
            const last_id_animal = await Animais.findAll({
                attributes: ['id'],
                order: [
                    ['id', 'DESC'],
                ],
                limit: 1
            });    
            
            for(var i = 0; last_id_animal.length>i;i++){ 
                var last_animalId = last_id_animal[i].id;
            }
            
            await Image_animais.create({
                image: req.file.filename,
                animalId: last_animalId
            }).then(() => {
                sharp(filepath)
                .resize({width:225})
                .jpeg({ mozjpeg: true })
                .toFile(`${newfilepath}`)
                .then( data => { 
                    console.log("foi: ");
                    fs.unlink(filepath, (err) => {
                        if (err) {
                            console.log(err);
                        }                  
                        //file removed
                    });
                })
                .catch( err => { 
                    console.log(err);
                });
            }).catch((err) => {
                console.log('Arquivo não enviado '+err);
                msg_erro = "?msg=Erro:-"+err;
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.log(err);
                    }                  
                    //file removed
                });
                // var msg_erro = err.replaceAll(' ','-');
                res.redirect("/sistema/cadastro-animais"+msg_erro);
                return;
            });
            res.redirect("/sistema/cadastro-animais"+msg_erro);
            return;
        }).catch(function(erro){
            console.log("Erro: animal Não Cadastrado! " + erro);
            msg_erro = "?msg=Erro:-"+erro;
            // var msg_erro = erro.replaceAll(' ','-');
            res.redirect("/sistema/cadastro-animais"+msg_erro);
            return;
        });
    }
});
// ###! Cadastrar

// listar
app.get('/sistema/animais', logado, async (req, res) => {   
    var vacinacoes = [];
    if(req.userValues.empresa == 'dev'){        
        var animal = await Animais.findAll();
        var vacinas = await Vacinas.findAll({          
            where: {
                estoque: {
                    [Op.gt] : 0
                }     
            }
        });
    }else{
        var animal = await Animais.findAll({            
            where: {
                empresa: req.userValues.empresa
            }
        });
        var vacinas = await Vacinas.findAll({            
            where: {
                empresa: req.userValues.empresa,
                estoque: {
                    [Op.gt]: 1
                }     
            }
        }); 
    }
    for(var i = 0; animal.length>i;i++){
        const getImage = await Image_animais.findOne({
            attributes: ['id','image'],
            where: {
                animalId: animal[i].id
            }
        });      
        const getUser_animal = await User.findOne({
            attributes: ['id','name','email'],
            where: {
                id: animal[i].userId
            }
        });   
        const getVacinacoes = await Vacinacoes.findAll({            
            where: {
                animalId: animal[i].id
            }
        });     
        if(getImage){
            animal[i]['imagem'] = getImage.image;
        }        
        if(getUser_animal){
            animal[i]['usuario'] = getUser_animal.name;
        }
        if(getVacinacoes){
            for(var a = 0; getVacinacoes.length>a;a++){
                // console.log(getVacinacoes[a].dataValues);
                // console.log("-----------------------------------------");
                vacinacoes.push(getVacinacoes[a].dataValues);
            }
        }
    }
    // console.log(vacinacoes);
    res.render('listar-animais',{'userValues' : req.userValues,'lista':animal,'lista_vacina':vacinas,'vacinacoes':vacinacoes});      
});
app.post("/sistema/att-animais-post", logado, async (req, res) => { 
        var tipo_form = req.body.animalTipo;
        const decode = await promisify(jwt.verify)(req.cookies.Authorization, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
        var id = decode.id; 
        if(tipo_form == "Outro"){
            tipo_form = req.body.OutroSubmit;
        }   
        await Animais.update(
            { 
                nome: req.body.model_dogname,
                model_raça: req.body.model_raça,
                obs: req.body.obs_dog,
                ativo: req.body.statusUsuario,
                tipo: tipo_form
            },
            { where: { id: req.body.model_id } }
          )
        .then(async () =>  {           
            console.log('Atualizado');
            if(req.body.statusUsuario == 1){               
                var animal = await Animais.findAll({       
                    raw : true,     
                    where: {
                        ativo: 1,
                        id: req.body.model_id
                    }
                });                      
                var usuarios = await User.findAll({ 
                    raw : true,                
                    where: {
                        ativo: 1,
                        newsletter: 'on'
                    }
                });           
                var titulo = "Novo cachorro encontrado! - segue as informações: ";
                var mensagem = "<b>Nome:</b> "+req.body.model_dogname+"<br><b>Raça:</b> "+req.body.model_raça+" - "+tipo_form+"<br><b>Empresa que achou:</b> "+animal[0].empresa+'<br><b><a href="www.google.com.br/maps/place/'+animal[0].latitude+','+animal[0].longitude+'" target="_blank">Localização</a></b>';
                var transport = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                    user: "1551d051b21b35",
                    pass: "35a1d7d2beba9e"
                    }
                });
                for(var i = 0; usuarios.length>i;i++){ 
                    console.log('entrando'+usuarios[i].email);    
                    var message = {
                        from: "norelpay@tcc.com.br",
                        to: usuarios[i].email,
                        subject: titulo,
                        text: 'Novo Cachorro encontrado segue as informações:',
                        html: mensagem
                    };
                    transport.sendMail(message);
                }
            }
            var input = req.body.vacinas_input;
            var vacinas  = input.split('-');
            await Vacinacoes.destroy({ where: { animalId: req.body.model_id } })
            for(var i = 0; vacinas.length>i;i++){
                if(vacinas[i]!=''){
                    await Vacinacoes.upsert(
                        { 
                            animalId: req.body.model_id,
                            userId: id,
                            vacinaId: vacinas[i],
                            empresa: req.userValues.empresa,
                            data_vacina: year + "-" + month + "-" + date
                        },
                        { where: { id: req.body.model_id } }
                    )
                }
            }
            res.redirect('/sistema/animais?msg=Atualizado-com-Sucesso');
        }).catch((err) => {
            console.log('Erro ao atualizar:'+ err)
            res.redirect('/sistema/animais?msg=Erro:-Problema-ao-Atualizar');
        });
});
app.post('/sistema/deletar-animais', logado, async (req, res) => {   
    if(req.userValues.type == 'admin'){
        if(req.body.id_delete != ''){   
            var count = await Animais.destroy({ where: { id: req.body.id_delete } })
            .then(() => {           
                console.log('Deletado');
                console.log(`deleted row(s): ${count}`);
                res.redirect('/sistema/animais?msg=Deletado-com-sucesso');    
                return true;
            }).catch((err) => {
                console.log('Erro ao deletar:'+ err);
                res.redirect('/sistema/animais?msg=Erro:-Problema-ao-Deletetar');  
                return false;  
            });
        }
    }
});
// ##! animais

// #! Sistema

//Erro 404 sempre no final
app.get('*',function(req, res){
    res.redirect('/?msg=Erro:-404-Pagina-nao-encontrada');  
});

// redirect para https
app.use(function(request, response){
    if(!request.secure){    
        response.redirect("https://" + request.headers.host + request.url);    
    }    
});

// rodando em https
https.createServer({
    cert: fs.readFileSync('ssl/code.crt'),
    key: fs.readFileSync('ssl/code.key'),
}, app).listen(port, () => console.log("Rodando em https"));
