const pool = require('../bancodedados/conexao')
const jwt = require('jsonwebtoken')

const verificarUsuarioLogado = async (req, res, next) => {
    const {authorization} = req.headers

    try {
        
        if (!authorization) {
            return res.status(400).json({
                mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."
            })
        }

        const token = authorization.split(' ')[1]

        const {usuario} = await jwt.verify(token, process.env.CHAVE_JWT)
        
        const {rows, rowCount} = await pool.query(
            'select * from usuarios where id = $1',
            [usuario]
        )
        
        if (rowCount < 1) {
            return res.status(401).json({ 
                mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." 
            })
        }   

      const {senha, ...usuario} = rows[0];
       req.usuario = usuario;

        next()

    } catch (erro) {
        return res.status(400).json({
            mensagem: erro.message
        })
    }

}

module.exports = verificarUsuarioLogado