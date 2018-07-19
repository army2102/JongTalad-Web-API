const express = require('express');

const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Auth route' });
});

// Market admin authentication
router.post('/register/marketadmin', (req, res) => {
  const { username, password } = req.body;
  findMarketAdminByUsernamePassword(
    username,
    password,
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }
      if (results.length === 0) {
        createMarketAdmin(username, password, (error, results, fields) => {
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
        });
      } else {
        utility.createError(409, 'This username is already taken', res);
      }
    }
  );
});

router.post('/login/marketadmin', (req, res) => {
  const { username, password } = req.body;
  findMarketAdminByUsernamePassword(
    username,
    password,
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }
      if (results.length === 1) {
        utility.createResponse(200, results, res);
      } else {
        utility.createError(404, 'Incorrect username or password', res);
      }
    }
  );
});

// Merchant authentication
router.post('/register/merchant', (req, res) => {
  const { username, password } = req.body;
  findMerchantByUsernamePassword(
    username,
    password,
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }
      if (results.length === 0) {
        createMerchant(username, password, (error, results, fields) => {
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
        });
      } else {
        utility.createError(409, 'This username is already taken', res);
      }
    }
  );
});

router.post('/login/merchant', (req, res) => {
  const { username, password } = req.body;
  findMerchantByUsernamePassword(
    username,
    password,
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }
      if (results.length === 1) {
        utility.createResponse(200, results, res);
      } else {
        utility.createError(404, 'Incorrect username or password', res);
      }
    }
  );
});

function findMarketAdminByUsernamePassword(username, password, callback) {
  const query =
    'SELECT market_admin_id AS marketAdminId FROM market_admins WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function findMarketAdminById(id, callback) {
  const query =
    'SELECT market_admin_id AS marketAdminId FROM market_admins WHERE market_admin_id = ?';
  connection.query(query, [id], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function updateMarketAdminById(id, columnName, value, callback) {
  const query = 'UPDATE market_admins SET ?? = ?  WHERE market_admin_id = ?';
  connection.query(query, [columnName, value, id], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function createMarketAdmin(username, password, callback) {
  const query = 'INSERT INTO market_admins (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function findMerchantByUsernamePassword(username, password, callback) {
  const query =
    'SELECT merchant_id AS merchantId FROM merchants WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function createMerchant(username, password, callback) {
  const query = 'INSERT INTO merchants (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function assignMarketAdminTo(marketAdminId, marketId, callback) {
  const query =
    'INSERT INTO  market_admin_markets (market_id, market_admin_id) VALUES (?, ?)';
  connection.query(
    query,
    [marketAdminId, marketId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
