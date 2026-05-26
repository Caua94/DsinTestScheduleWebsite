const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    telefone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Cliente', 'Administrador'],
        default: 'Cliente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);