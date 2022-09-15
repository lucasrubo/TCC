import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port,() => {
    console.log(`Servidor rodando na porta ${port}`);
});