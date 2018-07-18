const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/markets', (req, res) => {
  getVerifiedMarkets((error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

router.post('/:merchantId/markets/locks/:marketLockId/reserve', (req, res) => {
  const { merchantId, marketLockId } = req.params;
  const { productTypeId, price, saleDate } = req.body;
  utility.checkMarketLockStatus(
    { saleDate, marketLockId, type: 1 },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }

      if (results.length === 0) {
        reserveMarketLock(
          {
            merchantId,
            productTypeId,
            price,
            saleDate,
            marketLockId
          },
          (error, results, fields) => {
            if (error) {
              utility.createError(404, error, res);
            } else {
              utility.createResponse(
                200,
                {
                  affectedRows: results.affectedRows,
                  changedRows: results.changedRows
                },
                res
              );
            }
          }
        );
      } else {
        utility.createResponse(409, 'This lock is already reserved', res);
      }
    }
  );
});

function getVerifiedMarkets(callback) {
  const query = 'SELECT * FROM markets WHERE verified = 1';
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

function reserveMarketLock(
  { merchantId, productTypeId, price, saleDate, marketLockId },
  callback
) {
  const query = `UPDATE market_lock_reservations
    SET merchant_id = ?, reservation_status = 1, product_type_id = ?, reservation_date = NOW(), price = ?
    WHERE sale_date = ?
    AND market_lock_id = ?`;
  connection.query(
    query,
    [merchantId, productTypeId, price, saleDate, marketLockId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
