const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../util/database')
const SeatPricing = sequelize.define('SeatPricing', {
    seat_class: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    min_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    normal_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    max_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  })

  module.exports = SeatPricing
  