const Appointment = require('../models/Appointment');
const appointmentValidation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID é obrigatório' });
        }
        const agendamento = await Appointment.findById(id);
        if (!agendamento) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        const dataAtendimentoString = `${agendamento.data}T${agendamento.horario}:00`;
        const dataAtendimentoObj = new Date(dataAtendimentoString);


        const dataAtual = new Date();

        const diferencialMilissegundos = dataAtendimentoObj.getTime() - dataAtual.getTime();


        const doisdiasEmMs = 172800000;
        if (diferencialMilissegundos < doisdiasEmMs) {
            return res.status(400).json({ error: 'Não é possível alterar um agendamento com menos de 2 dias de antecedência' });
        }
        next();
    } catch (error) {
        console.error('Erro na validação do agendamento:', error);
        return res.status(500).json({ error: 'Erro na validação do agendamento' });

    }
};


module.exports = {
    appointmentValidation,
};