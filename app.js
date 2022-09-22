import express from 'express';

const app = express();
const port = 8080;

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

// index pages
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
app.get('/servicos', (req, res) => {
    res.render('servicos');
});
// conta page
app.get('/conta', (req, res) => {
    res.render('conta');
});

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});