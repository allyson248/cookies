const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Configuração para armazenar sessões
app.use(session({
    secret: 'segredo123',
    resave: false,
    saveUninitialized: true
}));

// Configuração para tratar requisições com body-parser e cookies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Produtos cadastrados
let produtos = [];

// Página de login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// Processa o login
app.post('/login', (req, res) => {
    const { nome } = req.body;
    if (nome) {
        req.session.usuario = nome;
        res.cookie('ultimoAcesso', new Date().toLocaleString());
        res.redirect('/cadastro');
    } else {
        res.send('Por favor, insira um nome para login.');
    }
});

// Página de cadastro de produtos
app.get('/cadastro', (req, res) => {
    if (!req.session.usuario) {
        return res.send('Você precisa realizar o login para acessar esta página. <a href="/">Login</a>');
    }
    res.sendFile(__dirname + '/views/cadastro.html');
});

// Processa o cadastro de produtos
app.post('/cadastro', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }

    const { codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = req.body;
    produtos.push({ codigo, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
    res.redirect('/tabela');
});

// Página com a tabela de produtos cadastrados
app.get('/tabela', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }

    const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';
    let tabela = `
        <h1>Produtos Cadastrados</h1>
        <p>Bem-vindo, ${req.session.usuario}</p>
        <p>Último acesso: ${ultimoAcesso}</p>
        <a href="/cadastro">Cadastrar outro produto</a>
        <table border="1">
            <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Preço de Custo</th>
                <th>Preço de Venda</th>
                <th>Validade</th>
                <th>Qtd em Estoque</th>
                <th>Fabricante</th>
            </tr>
    `;

    produtos.forEach(p => {
        tabela += `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.descricao}</td>
                <td>${p.precoCusto}</td>
                <td>${p.precoVenda}</td>
                <td>${p.validade}</td>
                <td>${p.estoque}</td>
                <td>${p.fabricante}</td>
            </tr>
        `;
    });

    tabela += '</table>';
    res.send(tabela);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
