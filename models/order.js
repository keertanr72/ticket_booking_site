const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    paymentId: Sequelize.STRING,
    status: Sequelize.STRING,
    totalAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Order