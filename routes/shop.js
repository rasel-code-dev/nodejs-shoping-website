
const express = require('express')
const router = express.Router()

const shopController = require('../controller/shop.js')

router.get('/shop', shopController.getShop)
router.get('/shop/products/:productId', shopController.getProductDetails)



module.exports = router