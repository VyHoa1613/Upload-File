const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart-controller')
router.get('/add/:id', cartController.addCart)
router.get('/', cartController.index)
router.post('/',cartController.rent)
module.exports = router