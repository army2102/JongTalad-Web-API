const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/:id/markets', (req, res) => {
  const { marketAdminId } = req.body;
  getMarketAdminMarketsById(marketAdminId, (error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

function getMarketAdminMarketsById(id, callback) {
  const query =
    'SELECT * FROM market_admin_markets AS mam JOIN markets ON mam.market_id = markets.market_id WHERE market_admin_id = ?';
  connection.query(query, [id], (error, results, fields) => {
    callback(error, results, fields);
  });
}

module.exports = router;
