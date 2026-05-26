const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        required: false,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    duracao: {
        type: Number,
        required: false,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Servico', servicoSchema);