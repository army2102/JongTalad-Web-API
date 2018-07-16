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

// TODO: Finish route logic //
router.post('/:marketId/locks/:lockId/reserve', (req, res) => {});

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

// TODO: Finish route logic //
function reserveMarketLock(callback) {
  const query = '';
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

function cancelMarketLock(callback) {
  const query = '';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function getMarketLockDetail(callback) {
  const query = '';
  connection.query(query, [mark], (error, results, fields) => {
    callback(error, results, fields);
  });
}

module.exports = router;
