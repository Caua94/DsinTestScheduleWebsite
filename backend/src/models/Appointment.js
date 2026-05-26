const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviçoId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],
    data: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pendente', 'Confirmado', 'Cancelado', 'Concluído'],
        default: 'Pendente'
    }
}, {
    timestamps: true

});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
