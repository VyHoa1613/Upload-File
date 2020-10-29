const express = require('express')
const router = express.Router()
const tranControllers = require('../controllers/transactions-controller')

router.get('/', tranControllers.index)

router.get('/create', tranControllers.getTranCreate)

router.get('/:id/update', tranControllers.getTranUpdate)

router.get('/:id/delete', tranControllers.deleteTran)

router.post('/create', tranControllers.postTranCreate)

router.post('/update', tranControllers.postTranUpdate)

module.exports = router