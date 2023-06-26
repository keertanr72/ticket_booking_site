const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('./util/database');

const Seat = require('./models/Seat')
const SeatPricing = require('./models/SeatPricing');
const User = require('./models/user')
const Order = require('./models/order')

const userRoute = require('./routes/user');
const seatRoute = require('./routes/seat')
const bookingRoute = require('./routes/booking')

const seatPricingCsvFilePath = './util/SeatPricing.csv';
const seatCsvFilePath = './util/Seat.csv';
const SeatPricingData = require('./controllers/seatPricingData')
const SeatData = require('./controllers/seatData')

const app = express();
const port = 3000;

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/user', userRoute);

app.use('/seats', seatRoute)

app.use('/booking', bookingRoute)

// Read the CSV file and insert the data into the database only if no data exists
SeatPricingData(seatPricingCsvFilePath)
SeatData(seatCsvFilePath)

User.hasMany(Seat)
Seat.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(Seat)
Seat.belongsTo(Order)

// Function to start the server
// function startServer() {
  sequelize
    .sync()
    // .sync({force: true})
    .then(() => {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
// }
