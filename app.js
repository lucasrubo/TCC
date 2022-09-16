import express from 'express';

const app = express();
const port = 8080;

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

// index page
app.get('/', (req, res) => {
    res.render('index');
});
// Sobre page
app.get('/sobre', (req, res) => {
    res.render('sobre');
});
// contato page
app.get('/contato', (req, res) => {
    res.render('contato');
});
// servico page
app.get('/servico', (req, res) => {
    res.render('servicos');
});

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});