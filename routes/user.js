const express = require('express')
const userController = require('../controllers/user')

const router = express()

router.post('/sign-up/check-email', userController.postCheckEmail)

router.post('/sign-up', userController.postCreateUser)

router.post('/login', userController.postLogin)

module.exports = router