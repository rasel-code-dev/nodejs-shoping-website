
const express = require('express')
const router = express.Router()

const authController = require('../controller/auth.js')

router.get('/auth/register', authController.getRegister)
router.post('/auth/register', authController.postRegister)

router.get('/auth/login', authController.getLogin)
router.post('/auth/login', authController.postLogin)

router.get('/auth/logout', authController.postLogout)


module.exports = router