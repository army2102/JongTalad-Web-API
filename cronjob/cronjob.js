const connection = require('../routes/connect');
const CronJob = require('cron').CronJob;

const job = new CronJob(
  '5 0 * * *',
  () => {
    checkIfMarketLockReservationsCreatedForToday((error, results, fields) => {
      if (error) {
        console.log('cron-job failed: ', error);
      } else if (results.length === 0) {
        createMarketLockReservations((error, results, fields) => {
          if (error) {
            console.log('cron-job failed: ', error);
          } else {
            console.log('Cron-Job success', results);
          }
        });
      } else {
        console.log('cron-job failed: Market lock for today is already created');
      }
    });
  },
  null,
  false,
  'Europe/Amsterdam'
);

function checkIfMarketLockReservationsCreatedForToday(callback) {
  const query = `SELECT 1 FROM market_lock_reservations
  WHERE sale_date = CURDATE()`;
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

function createMarketLockReservations(callback) {
  const query = `INSERT INTO market_lock_reservations ( market_admin_id, market_lock_id, sale_date, reservation_status, merchant_id, product_type_id, reservation_date, price) 
  VALUES
  (null, 1, CURDATE(), 0, null, null, null, null),
  (null, 2, CURDATE(), 0, null, null, null, null),
  (null, 3, CURDATE(), 0, null, null, null, null),
  (null, 4, CURDATE(), 0, null, null, null, null),
  (null, 5, CURDATE(), 0, null, null, null, null),
  (null, 6, CURDATE(), 0, null, null, null, null),
  (null, 7, CURDATE(), 0, null, null, null, null),
  (null, 8, CURDATE(), 0, null, null, null, null),
  (null, 9, CURDATE(), 0, null, null, null, null),
  (null, 10, CURDATE(), 0, null, null, null, null),
  (null, 11, CURDATE(), 0, null, null, null, null),
  (null, 12, CURDATE(), 0, null, null, null, null),
  (null, 13, CURDATE(), 0, null, null, null, null),
  (null, 14, CURDATE(), 0, null, null, null, null),
  (null, 15, CURDATE(), 0, null, null, null, null),
  (null, 16, CURDATE(), 0, null, null, null, null),
  (null, 17, CURDATE(), 0, null, null, null, null),
  (null, 18, CURDATE(), 0, null, null, null, null),
  (null, 19, CURDATE(), 0, null, null, null, null),
  (null, 20, CURDATE(), 0, null, null, null, null)`;

  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

module.exports = {
  job,
  checkIfMarketLockReservationsCreatedForToday,
  createMarketLockReservations
};
