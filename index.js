const express = require('express'); //O express é uma framework de Node.js minimal e flexível que fornece um conjunto robusto de capacidades para aplicações de web
const logger = require('morgan'); //É um logger de pedidos HTTP para o Node.js
const bodyParser = require('body-parser'); //Fazer parse aos corpos que vêm nos pedidos num middleware que ficam disponíveis na propriedade req.body
const path = require('path'); //Este modulo fornece ferramentas para trabalhar com caminhos de ficheiros e diretorias
const cookie = require('cookie-parser'); //para poder usar cookies
const jwt = require('jsonwebtoken'); //é uma norma(RFC 7519) que define uma maneira compacta de transmitir informação entre duas fações como um objeto JSON
const mongoose = require('./config/database'); //configuração da base de dados

const livros = require('./routes/livros'); //
const users = require('./routes/users'); //

const modeloLivro = require('./app/api/models/livros'); //é necessário para poder introduzir livros

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

// Rota publica - qualquer pessoa entra
app.use('/users', users);
app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

// Rota privada - e necessário login
app.use('/livros', validateUser, livros);

//seed data
var n;
let listaLivros = [];

modeloLivro.find({}, function (err, livros) {
    if (err) {
        res.sendFile(path.join(__dirname + '/app/views/erro.html'));
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

//função para validar utilizadores
function validateUser(req, res, next) {
    jwt.verify(req.cookies['token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.sendFile(path.join(__dirname + '/app/views/erro.html'));
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
    res.sendFile(path.join(__dirname + '/app/views/erro.html'));
});

// tratar de erros
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.sendFile(path.join(__dirname + '/app/views/erro.html'));
    else
        res.sendFile(path.join(__dirname + '/app/views/erro.html'));
});

// Começar o servidor
app.listen(process.env.PORT || 3000, console.log('Servidor no port  (•_•) ( •_•)>⌐■-■ (⌐■_■)  3000!'));