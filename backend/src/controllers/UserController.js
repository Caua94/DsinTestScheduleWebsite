const User = require('../models/User');
const criarUsuario = async (req, res) => {
    try {
        const { nome, telefone, password, role } = req.body;
        if (!nome || !telefone || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        let userExistente = await User.findOne({ telefone: telefone });
        if (userExistente) {
            return res.status(400).json({ error: 'Usuário com este telefone já existe' });
        }


        const novoUser = await User.create({
            nome,
            telefone,
            password,
            role,
        });

        return res.status(201).json({ message: 'Usuário criado com sucesso', user: novoUser });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }


}
const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();
        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.status(500).json({ error: 'Erro ao listar usuários' });
    }


}

const loginUsuario = async (req, res) => {
    try {
        const { telefone, password } = req.body;

       
        if (!telefone || !password) {
            return res.status(400).json({ error: 'Telefone e senha são obrigatórios' });
        }

        const usuario = await User.findOne({ telefone });
        if (!usuario) {
            return res.status(400).json({ error: 'Telefone ou senha incorretos.' });
        }

      
        if (usuario.password !== password) {
            return res.status(400).json({ error: 'Telefone ou senha incorretos.' });
        }

       
        const token = "TOKEN_DE_TESTE_LEILASALON"; 

     
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: usuario._id,
                nome: usuario.nome,
                telefone: usuario.telefone,
                role: usuario.role
            }
        });

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = {
    criarUsuario,
    listarUsuarios,
    loginUsuario,
}