const express = require('express');
const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/', (req, res) => {
  getProductTypes((error, results, fields) => {
    if (error) {
      utility.createError(404, error, res);
    } else {
      utility.createResponse(200, results, res);
    }
  });
});

function getProductTypes(callback) {
  const query = `SELECT product_type_id AS productTypeId ,name AS ProductTypeName
    FROM product_types`;
  connection.query(query, (error, results, fields) => {
    callback(error, results, fields);
  });
}

module.exports = router;
