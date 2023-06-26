const fs = require('fs');
const csv = require('csv-parser');
const Seat = require('../models/Seat');

function SeatData(csvFilePath) {
  Seat.count().then(async (count) => {
    if (count === 0) {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            await Seat.create(row);
          } catch (error) {
            console.error('Error inserting data:', error);
          }
        })
        .on('end', () => {
          console.log('Data upload completed.');
        });
    } else {
      console.log('Data already exists in the database. Skipping data upload.');
    }
  });
}

module.exports = SeatData;
