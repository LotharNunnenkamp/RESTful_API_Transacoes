const pool = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Informe todos os campos: nome, email e senha"
            })
        }

        const { rowCount } = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (rowCount > 0) {
            return res.status(400).json({
                mensagem: "Já existe usuário cadastrado com o e-mail informado."
            })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const { rows } = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        )

        return res.status(201).json({
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email
        })

    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        })
    }
}

const fazerLogin = async (req, res) => {
    const { email, senha } = req.body
    try {
        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Preencha os campos email e senha"
            })
        }

        const usuarioExiste = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (usuarioExiste.rowCount < 1) {
            return res.status(400).json({
                mensagem: "E-mail ou senha inválidos"
            })
        }

        if (!await bcrypt.compare(senha, usuarioExiste.rows[0].senha)) {
            return res.status(400).json({
                mensagem: "E-mail ou senha inválidos"
            })
        }

        const token = jwt.sign(
            {usuario: usuarioExiste.rows[0].id},
            process.env.CHAVE_JWT,
            {
                expiresIn: '8h'
            }
        )

        return res.status(200).json({
            "usuario": {
                id: usuarioExiste.rows[0].id,
                nome: usuarioExiste.rows[0].nome,
                email
            },
            "token": token
        })

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const detalharUsuario = async (req, res) => {
    const {id} = req.usuario;

    try {
        const {rows} = await pool.query(
            'select * from usuarios where id = $1', [id]
        )
  
        const resultado = {
            id,
            nome: rows[0].nome,
            email: rows[0].email
        }
        return res.json(resultado)
        
    } catch (error) {
        return res.status(401).json({
            mensagem: "Não autorizado."
        })
    }
}

const atualizarUsuario = async (req, res) => {
    const {id} = req.usuario;

    const {nome, email, senha} = req.body;    

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({mensagem: "Todos os campos são obrigatórios."})
        }

        const {rowCount} = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (rowCount > 1) {
            return res.status(400).json({mensagem: "O email informado já está sendo usado por outro usuário."})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        await pool.query(
            'update usuarios set nome = $1, email = $2, senha = $3 where id = $4', [nome, email, senhaCriptografada, id]
        )

        return res.status(204).send()        
        
    } catch (error) {
        return res.status(401).json({
            mensagem: "Não autorizado."
        })
    }
}

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    atualizarUsuario
}