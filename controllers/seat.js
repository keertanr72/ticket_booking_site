const Seat = require('../models/Seat');
const SeatPricing = require('../models/SeatPricing');

exports.getAllSeats = async (req, res) => {
    try {
        const sortedSeats = await Seat.findAndCountAll({
            order: [
                ['seat_class', 'ASC']
            ]
        });
        res.status(200).json({ seats: sortedSeats })
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(404)
    }
}

exports.getOneSeat = async (req, res) => {
    try {
        let price
        const seat_identifier = req.params.seat_identifier
        const seat_class = req.query.class
        const BookedCount = await Seat.count({ where: { isBooked: true, seat_class  } })
        const totalCount = await Seat.count({ where: { seat_class  } })
        const { min_price, normal_price, max_price } = await SeatPricing.findOne({ where: { seat_class } });
        percentageBooked = (BookedCount / totalCount) * 100
        if(percentageBooked > 60) {
            if(max_price === null) {
                price = normal_price
            } else {
                price = max_price
            }
        } else if(percentageBooked < 30) {
            if(min_price === null) {
                price = normal_price
            } else {
                price = min_price
            }
        } else {
            if(normal_price === null) {
                price = max_price
            } else {
                price = normal_price
            }
        }
        res.status(200).json({ seat_identifier, seat_class, price })
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(404)
    }
}