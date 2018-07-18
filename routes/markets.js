const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/:marketId/locks/types/:type', (req, res) => {
  const { marketId, type } = req.params;
  const { saleDate } = req.query;
  getMarketLocksByType(
    { marketId, type, saleDate },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      } else {
        utility.createResponse(200, results, res);
      }
    }
  );
});

router.post('/locks/:marketLockId/cancel', (req, res) => {
  const { marketLockId } = req.params;
  const { saleDate } = req.body;
  utility.checkMarketLockStatus(
    { saleDate, marketLockId, type: 0 },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }

      if (results.length === 0) {
        cancelMarketLock(
          { saleDate, marketLockId },
          (error, results, fields) => {
            if (error) {
              utility.createError(404, error, res);
            }
            if (results.affectedRows === 1) {
              createMarketLock(
                { saleDate, marketLockId },
                (error, results, fields) => {
                  if (error) {
                    utility.createError(404, error, res);
                  } else {
                    utility.createResponse(
                      201,
                      {
                        insertId: results.insertId,
                        affectedRows: results.affectedRows,
                        changedRows: results.changedRows
                      },
                      res
                    );
                  }
                }
              );
            } else {
              utility.createError(
                404,
                {
                  message:
                    'results.affectedRows !== 1, something might went wrong please contact admin at naetirat.s@gmail.com',
                  error: error || results
                },
                res
              );
            }
          }
        );
      } else {
        utility.createError(404, `This lock hasn't reserve yet`, res);
      }
    }
  );
});

router.get('/locks/:marketLockId/detail', (req, res) => {
  const { marketLockId } = req.params;
  const { saleDate } = req.query;
  getMarketLockDetail({ marketLockId, saleDate }, (error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    }
    if (results.length === 1) {
      utility.createResponse(200, results, res);
    } else if (results.length === 0) {
      utility.createError(404, `This lock hasn't reserve yet`, res);
    } else {
      utility.createError(
        404,
        {
          message:
            'results.length >= 1, something might went wrong please contact admin at naetirat.s@gmail.com',
          error: error || results
        },
        res
      );
    }
  });
});

function getMarketLocksByType({ marketId, type, saleDate }, callback) {
  const query = `SELECT mlr.market_admin_id, mlr.merchant_id, ml.market_lock_id, ml.name, ml.price, mlr.sale_date, mlr.reservation_status 
  FROM market_lock_reservations AS mlr
  JOIN market_locks AS ml ON ml.market_lock_id = mlr.market_lock_id
  JOIN markets ON ml.market_id = markets.market_id
  WHERE ml.market_id = ?
  AND mlr.reservation_status = ?
  AND sale_date = ?`;
  connection.query(
    query,
    [marketId, type, saleDate],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function cancelMarketLock({ saleDate, marketLockId }, callback) {
  const query = `UPDATE market_lock_reservations
  SET reservation_status = 3
  WHERE sale_date = ?
  AND market_lock_id = ?;`;
  connection.query(
    query,
    [saleDate, marketLockId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function createMarketLock({ marketLockId, saleDate }, callback) {
  const query = `INSERT INTO market_lock_reservations (market_admin_id, market_lock_id, sale_date, reservation_status, merchant_id, product_type_id, reservation_date, price)
  VALUES (null, ?, ?, 0, null, null, null, null)`;
  connection.query(
    query,
    [marketLockId, saleDate],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function getMarketLockDetail({ marketLockId, saleDate }, callback) {
  const query = `SELECT mlr.market_admin_id, mlr.merchant_id, ml.name AS market_lock_name, pt.name  FROM market_lock_reservations AS mlr
  JOIN product_types AS pt ON mlr.product_type_id = pt.product_type_id
  JOIN market_locks AS ml ON mlr.market_lock_id = ml.market_lock_id
  WHERE mlr.reservation_status = 1
  AND mlr.market_lock_id = ?
  AND sale_date = ?`;
  connection.query(
    query,
    [marketLockId, saleDate],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
