const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { criarUsuario, listarUsuarios, obterUsuarioPorId, atualizarUsuario, excluirUsuario } = require('../controllers/UserController');

router.post('/criar', UserController.criarUsuario); 
router.get('/listar', UserController.listarUsuarios);
router.post('/login', UserController.loginUsuario);

module.exports = router;