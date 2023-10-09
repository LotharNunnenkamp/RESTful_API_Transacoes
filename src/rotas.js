const {Router} = require('express');

const {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuarios');

const categorias = require('./controladores/categorias');
const transacoes = require('./controladores/transacoes');

const verificarUsuarioLogado = require('./intermediários/auth');

const rotas = Router();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', fazerLogin);
rotas.use(verificarUsuarioLogado);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categorias', categorias.listar);

rotas.get('/transacoes', transacoes.listarDoUsuario);
rotas.get('/transacoes/extrato', transacoes.exibirExtrato);
rotas.get('/transacoes/:id', transacoes.detalhar);

rotas.post('/transacoes', transacoes.cadastrar);

rotas.put('/transacoes/:id', transacoes.atualizar);

rotas.delete('/transacoes/:id', transacoes.deletar);

module.exports = rotas;