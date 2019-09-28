
const express = require('express')

const auth = require('../middleware/is-Auth')

const router = express.Router()

const adminController = require('../controller/admin.js')

router.get('/admin-product',  adminController.getAdminProduct)

router.get('/add-product', auth, adminController.getAddProduct)
router.post('/add-product', auth, adminController.postAddProduct)


router.post('/delete/:productId', auth, adminController.postDeleteProduct)



router.get('/cart', adminController.getCart)
router.post('/add-cart', adminController.addToCart)
router.get('/delete-cart/:productId', adminController.deleteCart)


module.exports = router