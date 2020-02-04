const express = require('express');
const router = express.Router();

const userController = require('../app/api/controllers/users');
//rotas
router.get('/register', userController.paginaRegister);
router.post('/register', userController.create);
router.get('/authenticate', userController.paginaAuth);
router.post('/authenticate', userController.authenticate);
router.get('/editar', userController.paginaEditar); //rota para ir para a pagina de editar o utilizador
router.get('/procurar/:UserID', userController.procurarPorID); //rota para procurar pelo id
router.post('/editar', userController.updateById);

module.exports = router;