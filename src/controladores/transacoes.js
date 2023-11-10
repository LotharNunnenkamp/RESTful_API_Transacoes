const pool = require('../bancodedados/conexao');

const listarDoUsuario = async (req, res) => {

    const { id } = req.usuario; 
    const { filtro } = req.query;

    try {

        const query = `
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_descricao from transacoes as t
            join categorias as c on t.categoria_id = c.id 
            where t.usuario_id = $1
        `;

        const transacoesDoUsuario = await pool.query(query, [id]);

        if (filtro) {

            const transacoesFiltradas = transacoesDoUsuario.rows.filter((transacao) => {
                
                const { categoria_nome } = transacao;
                let selecionarTransacao = false;

                for (let categoria of filtro) {

                    if (categoria_nome.toLowerCase() == categoria.toLowerCase()) {

                        selecionarTransacao = true;
                    }
                }

                return selecionarTransacao;
            });

            return res.status(200).json(transacoesFiltradas);
        }

        return res.status(200).json(transacoesDoUsuario.rows);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const detalhar = async (req, res) => {

    const { id: idTransacao } = req.params;
    const { id: idUsuario } = req.usuario; 

    try {

        const query = `
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes as t
            join categorias as c on t.categoria_id = c.id 
            where t.id = $1;
        `;

        const transacao = await pool.query(query, [idTransacao]);

        if (transacao.rowCount < 1) {

            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }

        if (transacao.rows[0].usuario_id != idUsuario) {

            return res.status(401).json({ mensagem: 'O usuário não tem permissão para ver esta transação.' });
        }

        return res.status(200).json(transacao.rows[0]);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const cadastrar = async (req, res) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.usuario; 

    if (!descricao || !valor || !data || !categoria_id || !tipo) {

        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }

    if (tipo.toLowerCase() !== 'entrada' && tipo.toLowerCase() !== 'saida') {

        return res.status(400).json({ mensagem: 'Tipo inválido, informe se é uma entrada ou uma saida.' });
    }

    try {

        const categoria = await pool.query('select * from categorias where id = $1', [categoria_id]);

        if (categoria.rowCount < 1) {

            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }

        const query = `insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id)
            values ($1, $2, $3, $4, $5, $6)
            returning *;`
        const params = [descricao, valor, data, categoria_id, tipo, id];

        const transacaoCadastrada = await pool.query(query, params);

        transacaoCadastrada.rows[0].categoria_nome = categoria.rows[0].nome;

        return res.status(201).json(transacaoCadastrada.rows[0]);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const atualizar = async (req, res) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id: idTransacao } = req.params;
    const { id: idUsuario } = req.usuario;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {

        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' });
    }

    if (tipo.toLowerCase() !== 'entrada' && tipo.toLowerCase() !== 'saida') {

        return res.status(400).json({ mensagem: 'Tipo inválido, informe se é uma entrada ou uma saida.' });
    }

    try {

        const categoria = await pool.query('select * from categorias where id = $1', [categoria_id]);

        if (categoria.rowCount < 1) {

            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }

        const transacao = await pool.query('select * from transacoes where id = $1', [idTransacao]);

        if (transacao.rowCount < 1) {

            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }

        if (transacao.rows[0].usuario_id != idUsuario) {

            return res.status(401).json({ mensagem: 'O usuário não tem permissão para alterar esta transação.' });
        }

        const query = `
            update transacoes
            set 
            descricao = $1,
            valor = $2,
            data = $3,
            categoria_id = $4,
            tipo = $5
            where id = $6;
        `;
        const params = [descricao, valor, data, categoria_id, tipo, idTransacao];

        await pool.query(query, params);

        return res.status(201).json();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const deletar = async (req, res) => {

    const { id: idTransacao } = req.params;
    const { id: idUsuario } = req.usuario; 

    try {

        const transacao = await pool.query('select * from transacoes where id = $1', [idTransacao]);

        if (transacao.rowCount < 1) {

            return res.status(404).json({ mensagem: 'Transação não encontrada.' });
        }

        if (transacao.rows[0].usuario_id != idUsuario) {

            return res.status(401).json({ mensagem: 'O usuário não tem permissão para alterar esta transação.' });
        }

        await pool.query('delete from transacoes where id = $1', [idTransacao]);

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

const exibirExtrato = async (req, res) => {

    const { id } = req.usuario; 

    try {
        
        const transacoesDoUsuario = await pool.query('select * from transacoes where usuario_id = $1', [id]);

        const extrato = {
            entrada: 0,
            saida: 0
        }

        transacoesDoUsuario.rows.map((transacao) => {
            const { tipo, valor } = transacao;

            return tipo === 'entrada'? extrato.entrada += valor : extrato.saida += valor;
        });

        return res.status(200).json(extrato);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        })
    }
}

module.exports = {
    listarDoUsuario,
    detalhar,
    cadastrar,
    atualizar,
    deletar,
    exibirExtrato
}