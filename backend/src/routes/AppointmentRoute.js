const express = require('express');
const router = express.Router();
const { 
    obterHorariosDisponiveis, 
    criarAgendamento, 
    listarAgendamentos, 
    listarTodosAgendamentosAdmin,
    atualizarStatusAgendamento
} = require('../controllers/appointmentController');
const { appointmentValidation } = require('../middlewares/validacoes');


router.get('/disponiveis', obterHorariosDisponiveis);
router.post('/', criarAgendamento);
router.get('/', listarAgendamentos);
router.put('/cancelar/:id', appointmentValidation, atualizarStatusAgendamento);
router.get('/admin', listarTodosAgendamentosAdmin);

module.exports = router;