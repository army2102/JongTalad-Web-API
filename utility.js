const connection = require('./routes/connect');

module.exports = {
  createError: (statusCode = 404, error, res) => {
    res.status(statusCode).json({
      code: res.statusCode,
      error,
      response: null
    });
  },

  createResponse: (statusCode = 200, responseBody, res) => {
    res.status(statusCode).json({
      code: res.statusCode,
      error: null,
      response: responseBody
    });
  },

  // Used by /route marketadmins.js:23 & marchants.js:20
  checkMarketLockStatus: ({ saleDate, marketLockId, type }, callback) => {
    const query = `SELECT market_lock_id, reservation_status
    FROM market_lock_reservations
    WHERE sale_date = ?
    AND market_lock_id = ?
    AND reservation_status = ?`;
    connection.query(
      query,
      [saleDate, marketLockId, type],
      (error, results, fields) => {
        callback(error, results, fields);
      }
    );
  }
};
