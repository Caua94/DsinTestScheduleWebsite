const express = require('express');
const router = express.Router();
const { 
    obterHorariosDisponiveis, 
    criarAgendamento, 
    listarAgendamentos, 
    listarTodosAgendamentosAdmin,
    atualizarStatusAgendamento,
    verificarSugestaoSemana
} = require('../controllers/appointmentController');
const { appointmentValidation } = require('../middlewares/validacoes');


router.get('/disponiveis', obterHorariosDisponiveis);
router.post('/', criarAgendamento);
router.get('/', listarAgendamentos);
router.put('/cancelar/:id', appointmentValidation, atualizarStatusAgendamento);
router.get('/admin', listarTodosAgendamentosAdmin);
router.get('/sugestao', verificarSugestaoSemana);

module.exports = router;