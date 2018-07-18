const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/:marketAdminId/markets', (req, res) => {
  const { marketAdminId } = req.params;
  getMarketAdminMarketsById(marketAdminId, (error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

router.post(
  '/:marketAdminId/markets/locks/:marketLockId/reserve',
  (req, res) => {
    const { marketAdminId, marketLockId } = req.params;
    const { productTypeId, price, saleDate } = req.body;
    utility.checkMarketLockStatus(
      { saleDate, marketLockId, type: 1},
      (error, results, fields) => {
        if (error) {
          utility.createError(404, error, res);
        }

        if (results.length === 0) {
          reserveMarketLock(
            {
              marketAdminId,
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
  }
);

function getMarketAdminMarketsById(id, callback) {
  const query =
    'SELECT * FROM market_admin_markets AS mam JOIN markets ON mam.market_id = markets.market_id WHERE market_admin_id = ?';
  connection.query(query, [id], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function reserveMarketLock(
  { marketAdminId, productTypeId, price, saleDate, marketLockId },
  callback
) {
  const query = `UPDATE market_lock_reservations
  SET market_admin_id = ?, reservation_status = 1, product_type_id = ?, reservation_date = NOW(), price = ?
  WHERE sale_date = ?
  AND market_lock_id = ?`;
  connection.query(
    query,
    [marketAdminId, productTypeId, price, saleDate, marketLockId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
