const pool = require('../bancodedados/conexao');

const listar = async (req, res) => {
    try {
        const categorias = await pool.query('select * from categorias');
        return res.status(200).json(categorias.rows);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

module.exports = {
    listar
}