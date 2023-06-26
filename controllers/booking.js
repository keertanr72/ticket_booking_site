const Razorpay = require('razorpay');
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const sequelize = require('../util/database');
const User = require('../models/user');
const Order = require('../models/order');
const Seat = require('../models/Seat');

exports.sendEmail = async (req, res) => {
  const userEmail = req.user.email
  const client = Sib.ApiClient.instance
  const apiKey = client.authentications['api-key']
  apiKey.apiKey = process.env.API_KEY
  const tranEmailApi = new Sib.TransactionalEmailsApi()
  try {
    const sender = {
      email: 'keertanr72@gmail.com'
    }
    const receivers = [
      {
        email: `${userEmail}`,
      },
    ]
    const seatIdentifiers = req.body.data.map(element => element.seat_identifier);
    const seatIdentifiersString = seatIdentifiers.toString();
    const p1 = tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Ticket booking details',
      textContent:
        `Order id : ${req.body.order_id}
        amount: ${req.amount}
        Seats: ${seatIdentifiersString}`
    })
    const userData = User.findOne({ where: { email: userEmail } })
    const returnedPromise = await Promise.all([p1, userData])
    if (!returnedPromise[1])
      res.status(403).json({ message: 'user doesnt exist' })
    res.status(200).json({ message: 'successfull' })
  } catch (error) {
    console.log(error)
  }

}

exports.bookTickets = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let totalAmount = 0;
    const order_seat_identifiers = req.body.data.map(element => {
      totalAmount += element.price;
      return element.seat_identifier;
    });

    const rzp = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret
    });

    const amount = Math.floor(100 * totalAmount)
    rzp.orders.create({ amount: amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        console.log(err, amount)
        await t.rollback();
        return res.status(500).json({ message: 'rzp order unsuccessfull' });
      }

      await Order.create({ id: order.id, userId: req.user.userId, status: 'pending', totalAmount }, { transaction: t });

      await Seat.update(
        { isBooked: true, userId: req.user.userId, orderId: order.id },
        { where: { seat_identifier: order_seat_identifiers }, transaction: t }
      );
      await t.commit();
      return res.status(200).json({ order, key_id: rzp.key_id });
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

exports.paymentSuccess = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    console.log('paymentSuccess', req.user.userId);
    const userData = User.findByPk(req.user.userId);
    const orderData = Order.findByPk(req.body.order_id);

    const result = await Promise.all([userData, orderData]);

    const orderUpdate = result[1].update(
      { paymentId: req.body.payment_id, status: 'success' },
      { transaction: t }
    );

    const userUpdate = result[0].update(
      { isPremium: true },
      { transaction: t }
    );

    await Promise.all([userUpdate, orderUpdate]);
    await t.commit();
    const orderPrice = await Order.findByPk(req.body.order_id)
    req.amount = orderPrice.totalAmount
    next()
    // res.status(200).json({ order_id: req.body.order_id, totalAmount: orderPrice.totalAmount });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

exports.paymentFail = async (req, res) => {
  try {
    const order_seat_identifiers = req.body.data.map(element => {
      return element.seat_identifier
    });
    await Seat.update(
      { isBooked: false, userId: null },
      { where: { seat_identifier: order_seat_identifiers } }
    );
    res.status(200).json({ message: 'payment cancelled' })
  } catch (error) {
    console.log(error)
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const orderDetails = await Order.findAll({ where: { userId: req.user.userId } })
    res.status(200).json({ orderDetails })
  } catch (error) {
    console.log(error)
  }
}