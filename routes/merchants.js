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
  const MAXIMUM_LOCK_RESERVATION = 3;
  checkNumberOfReservedMarketLock(
    { saleDate, merchantId },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }

      if (results.length >= 3) {
        utility.createError(409, `You can not reserve more that 3 locks`, res);
      } else {
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
                  }
                  if (results.affectedRows === 0 && results.changedRows === 0) {
                    utility.createResponse(
                      409,
                      `This lock hasn't create yet`,
                      res
                    );
                  } else {
                    utility.createResponse(
                      200,
                      {
                        reservedMarketLockId: marketLockId,
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
      }
    }
  );
});

function getVerifiedMarkets(callback) {
  const query = `SELECT market_id AS marketId, name AS marketName, address AS marketAddress, picture_url AS pictureUrl, verified 
  FROM markets 
  WHERE verified = 1`;
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

function checkNumberOfReservedMarketLock({ saleDate, merchantId }, callback) {
  const query = `SELECT mlr.market_lock_id AS marketLockId, ml.name AS marketLockName
  FROM market_lock_reservations AS mlr
  JOIN market_locks AS ml ON mlr.market_lock_id = ml.market_lock_id 
  WHERE mlr.sale_date = ?
  AND mlr.merchant_id = ?
  AND mlr.reservation_status = 1`;
  connection.query(query, [saleDate, merchantId], (error, results, fields) => {
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
    AND market_lock_id = ?
    AND reservation_status = 0`;
  connection.query(
    query,
    [merchantId, productTypeId, price, saleDate, marketLockId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
