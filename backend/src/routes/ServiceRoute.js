
const express = require('express');
const router = express.Router();


const { 
    criarServico, 
    listarServicos, 
    obterServicoPorId, 
    atualizarServico, 
    excluirServico 
} = require('../controllers/ServiceController');


router.get('/', listarServicos);  
router.post('/', criarServico);

router.get('/:id', obterServicoPorId); 
router.put('/:id', atualizarServico);  
router.delete('/:id', excluirServico); 

module.exports = router;