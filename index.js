const express = require('express');
const logger = require('morgan');
const livros = require('./routes/livros');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //configuração da base de dados
const path = require('path');
const cookie = require('cookie-parser');
const modeloLivro = require('./app/api/models/livros');
var jwt = require('jsonwebtoken');
const app = express();

app.set('secretKey', 'nodeRestApi'); // jwt secret token

// conexão ao mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie());
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/views/index.html'));
});
app.use(express.static(path.join(__dirname, '/app/css')));
app.use(express.static(path.join(__dirname, '/app/javascript')));

// Rota publica
app.use('/users', users);

// Rota privada
app.use('/livros', validateUser, livros);
app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

//seed data
var n;
let listaLivros = [];
modeloLivro.find({}, function (err, livros) {
    if (err) {
        next(err);
    } else {
        for (let livro of livros) {
            listaLivros.push({
                id: livro._id,
                nome: livro.nome,
                dataLancamento: livro.dataLancamento
            });
        }
    }
    n = listaLivros.length;
    if (n == 0) {
        console.log('Não existem livros na base de dados.');
        console.log('Inserir dados...');
        seedData();
        return;
    }
    console.log('Existem livros na base de dados.');
    console.log('Não é necessário inserir mais.')
});
function seedData() {
    modeloLivro.create(
        {
            nome: "The Lord of the Rings",
            dataLancamento: "29/07/1954"
        },
        {
            nome: "The Alchemist",
            dataLancamento: "--/--/1988"
        },
        {
            "nome": "The Little Prince",
            "dataLancamento": "--/04/1943"
        },
        {
            "nome": "grimm's Fairy Tales",
            "dataLancamento": "1812-1858"
        },
        {
            "nome": "Harry Potter and the Philosopher's Stone",
            "dataLancamento": "26/06/1997"
        },
        {
            "nome": "The Hobbit/There and Back Again",
            "dataLancamento": "21/09/1937"
        },
        {
            "nome": "And Then There Were None",
            "dataLancamento": "06/11/1939"
        },
        {
            "nome": "Dream of the Red Chamber",
            "dataLancamento": "--/--/1868"
        },
        {
            "nome": "The Lion, the Witch and the Wardrobe",
            "dataLancamento": "16/10/1950"
        },
        {
            "nome": "She: A History of Adventure",
            "dataLancamento": "1886-1887"
        }
    );
    console.log('Dados inseridos.');
}
function validateUser(req, res, next) {
    jwt.verify(req.cookies['token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({
                estado: "error",
                mensagem: err.message,
                dado: null
            });
        } else {
            // adicionar o id do utilizador ao pedido
            req.body.userId = decoded.id;
            next();
        }
    });
}
// o express não considera 'not found 404' como um erro por isso temos tratar dele explicitamente
// tratar do erro 404
app.use(function (req, res, next) {
    let err = new Error('Não encontrado...');
    err.status = 404;
    next(err);
});
// tratar de erros
app.use(function (err, req, res, next) {
    console.log(err);
    if (err.status === 404)
        res.status(404).json({ message: "Não sei onde esta essa pagina... ¯\_(ツ)_/¯" });
    else
        res.status(500).json({ message: "Algo não esta bem... ¯\_(ツ)_/¯" });
});
app.listen(3000, function () {
    console.log('Servidor no port  (•_•) ( •_•)>⌐■-■ (⌐■_■)  3000!');
});