const Service = require('../models/Service');

const criarServico = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const novoServico = await Service.create({
            name,
            description,
            price,
            duracao: 60
        });

        return res.status(201).json({ message: 'Serviço criado com sucesso', servico: novoServico });
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        return res.status(500).json({ error: 'Erro ao criar serviço' });
    }


};


const listarServicos = async (req, res) => {
    try {
        const servicos = await Service.find();
        return res.status(200).json({ servicos });
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
        return res.status(500).json({ error: 'Erro ao listar serviços' });
    }
};

const obterServicoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const servico = await Service.findById(id);

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        return res.status(200).json({ servico });
    } catch (error) {
        console.error('Erro ao obter serviço:', error);
        return res.status(500).json({ error: 'Erro ao obter serviço' });
    }
};

const atualizarServico = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        const servico = await Service.findByIdAndUpdate(id, { name, description, price }, { new: true });

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        return res.status(200).json({ message: 'Serviço atualizado com sucesso', servico });
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        return res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
};

const excluirServico = async (req, res) => {
    try {
        const { id } = req.params;

        const servico = await Service.findByIdAndDelete(id);

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        return res.status(200).json({ message: 'Serviço excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        return res.status(500).json({ error: 'Erro ao excluir serviço' });
    }
};


module.exports = {
    criarServico,
    listarServicos,
    obterServicoPorId,
    atualizarServico,
    excluirServico
};