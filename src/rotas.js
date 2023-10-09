const {Router} = require('express');

const {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuarios');

const verificarUsuarioLogado = require('./intermediários/auth');

const rotas = Router();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', fazerLogin);
rotas.use(verificarUsuarioLogado);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

module.exports = rotas;