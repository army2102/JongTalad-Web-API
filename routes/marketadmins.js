const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/:marketAdminId/markets', (req, res) => {
  const { marketAdminId } = req.params;
  getVerifiedMarketAdminMarketsById(marketAdminId, (error, results, fields) => {
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
    const {
      productTypeId,
      price,
      saleDate,
      marketAdminMerchantName,
      marketAdminMerchantPhonenumber
    } = req.body;
    utility.checkMarketLockStatus(
      { saleDate, marketLockId, type: 1 },
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
              marketAdminMerchantName,
              marketAdminMerchantPhonenumber,
              saleDate,
              marketLockId
            },
            (error, results, fields) => {
              if (error) {
                utility.createError(404, error, res);
              }
              if (results.affectedRows === 0 && results.changedRows === 0) {
                utility.createResponse(409, `This lock hasn't create yet`, res);
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
);

function getVerifiedMarketAdminMarketsById(id, callback) {
  const query = `SELECT mam.market_id AS marketId, mam.market_admin_id AS marketAdminId, markets.name AS marketName, markets.address AS marketAddress, markets.picture_url AS pictureUrl 
  FROM market_admin_markets AS mam 
  JOIN markets ON mam.market_id = markets.market_id 
  WHERE market_admin_id = ?
  AND markets.verified = 1`;
  connection.query(query, [id], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function reserveMarketLock(
  {
    marketAdminId,
    productTypeId,
    price,
    saleDate,
    marketLockId,
    marketAdminMerchantName,
    marketAdminMerchantPhonenumber
  },
  callback
) {
  const query = `UPDATE market_lock_reservations
  SET market_admin_id = ?, reservation_status = 1, product_type_id = ?, reservation_date = CURDATE(), price = ?, market_admin_merchant_name = ?, market_admin_merchant_phonenumber = ?
  WHERE sale_date = ?
  AND market_lock_id = ?
  AND reservation_status = 0`;
  connection.query(
    query,
    [
      marketAdminId,
      productTypeId,
      price,
      marketAdminMerchantName,
      marketAdminMerchantPhonenumber,
      saleDate,
      marketLockId
    ],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
