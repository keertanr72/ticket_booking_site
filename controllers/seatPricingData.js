const fs = require('fs');
const csv = require('csv-parser');
const SeatPricing = require('../models/SeatPricing');

function parseNumericValue(value) {
  if (value.startsWith('$')) {
    value = value.slice(1); // Remove the first character ('$')
  }
  if (value === '' || value === 'NaN') {
    return null;
  }
  return parseFloat(value.replace(/,/g, '')); // Remove commas and parse as float
}

function SeatPricingData(csvFilePath) {
  SeatPricing.count().then(async (count) => {
    if (count === 0) {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            row.min_price = parseNumericValue(row.min_price);
            row.normal_price = parseNumericValue(row.normal_price);
            row.max_price = parseNumericValue(row.max_price);

            Object.keys(row).forEach((key) => {
              if (row[key] === '') {
                row[key] = null;
              }
            });

            await SeatPricing.create(row);
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

module.exports = SeatPricingData;
