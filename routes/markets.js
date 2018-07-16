const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/', (req, res) => {
  getMarkets((error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

router.get('/:marketId/locks/:lockId/types/:type', (req, res) => {
  const { marketId, lockId, type } = req.params;
  getMarketLocksByType(marketId, lockId, type, (error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

router.post('/:marketId/locks/:lockId/reserve', (req, res) => {
  const { marketId, lockId } = req.params;
  const { marketAdminId, saleDate, merchantId, productTypeId } = req.body;
  reserveMarketLock(
    { marketId, lockId, marketAdminId, saleDate, merchantId, productTypeId },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      } else {
        utility.createResponse(200, results, res);
      }
    }
  );
});

router.post('/:marketId/locks/:lockId/cencel', (req, res) => {});

router.get('/:marketId/locks/:lockId/detail', (req, res) => {});

function getMarkets(callback) {
  const query = 'SELECT * FROM markets';
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

function getMarketLocksByType(marketId, lockId, type, callback) {
  const query = 'SELECT * FROM market_locks JOIN ';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function reserveMarketLock(
  { marketId, lockId, marketAdminId, saleDate, merchantId, productTypeId },
  callback
) {
  const query = 'AL * FROM markets';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function cancelMarketLock(marketId, lockId, type, callback) {
  const query = 'SELECT * FROM markets';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function getMarketLockDetail(marketId, lockId, type, callback) {
  const query = 'SELECT * FROM markets';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

module.exports = router;
