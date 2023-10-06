const {Router} = require('express');

const {
    cadastrarUsuario,
    fazerLogin
} = require('./controladores/usuarios');

const verificarUsuarioLogado = require('./intermediários/auth');

const rotas = Router();

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', fazerLogin)

rotas.use(verificarUsuarioLogado)

module.exports = rotas