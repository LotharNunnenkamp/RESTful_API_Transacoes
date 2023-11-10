const { Router } = require('express');

const {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    atualizarUsuario
} = require('../controladores/usuarios');

const categorias = require('../controladores/categorias');
const transacoes = require('../controladores/transacoes');

const verificarUsuarioLogado = require('../intermediários/auth');

const rotas = Router();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', fazerLogin);
rotas.use(verificarUsuarioLogado);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.get('/categoria', categorias.listar);
rotas.get('/transacao', transacoes.listarDoUsuario);
rotas.get('/transacao/extrato', transacoes.exibirExtrato);
rotas.get('/transacao/:id', transacoes.detalhar);
rotas.post('/transacao', transacoes.cadastrar);
rotas.put('/transacao/:id', transacoes.atualizar);
rotas.delete('/transacao/:id', transacoes.deletar);

module.exports = rotas;