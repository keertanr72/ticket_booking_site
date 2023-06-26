const express = require('express')
const authorizationController = require('../controllers/authorization')
const bookingController = require('../controllers/booking')

const router = express()

router.post('/', authorizationController.checkUser, bookingController.bookTickets)

router.post('/payment-success', authorizationController.checkUser, bookingController.paymentSuccess, bookingController.sendEmail)

router.put('/payment-fail', authorizationController.checkUser, bookingController.paymentFail)

router.get('/', authorizationController.checkUser, bookingController.getUserOrders)

module.exports = router