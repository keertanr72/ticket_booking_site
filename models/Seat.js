const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../util/database')
const Seat = sequelize.define('Seat', {
  seat_identifier: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  seat_class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})

module.exports = Seat
