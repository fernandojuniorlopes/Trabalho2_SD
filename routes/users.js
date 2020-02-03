const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');
router.get('/register', userController.paginaRegister);
router.post('/register', userController.create);
router.get('/authenticate', userController.paginaAuth)
router.post('/authenticate', userController.authenticate);
module.exports = router;