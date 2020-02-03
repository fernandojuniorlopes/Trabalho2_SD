const express = require('express');
const router = express.Router();
const livrosController = require('../app/api/controllers/livros');
router.get('/', livrosController.page);

router.get('/all', livrosController.getAll);

router.post('/adicionar', livrosController.create);

router.get('/adicionar', livrosController.adicionar);

router.get('/livro', livrosController.detalhes);

router.get('/:livroId', livrosController.getById);

router.put('/:livroId', livrosController.updateById);

router.delete('/:livroId', livrosController.deleteById);

module.exports = router;