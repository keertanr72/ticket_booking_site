const express = require('express')
const seatController = require('../controllers/seat')

const router = express()

router.get('/', seatController.getAllSeats)
router.get('/:seat_identifier', seatController.getOneSeat)

module.exports = router