const express = require('express');

const router = express.Router();

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
        createError(404, error, res);
      }
      if (results.length === 0) {
        createMarketAdmin(username, password, (error, results, fields) => {
          if (error) {
            createError(404, error, res);
          } else {
            createResponse(
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
        createError(409, 'This username is already taken', res);
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
        createError(404, error, res);
      }
      if (results.length === 1) {
        createResponse(200, { marketAdminId: results[0].market_admin_id }, res);
      } else {
        createError(404, 'Incorrect username or password', res);
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
        createError(404, error, res);
      }
      if (results.length === 0) {
        createMerchant(username, password, (error, results, fields) => {
          if (error) {
            createError(404, error, res);
          } else {
            createResponse(
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
        createError(409, 'This username is already taken', res);
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
        createError(404, error, res);
      }
      if (results.length === 1) {
        createResponse(200, { merchantId: results[0].merchant_id }, res);
      } else {
        createError(404, 'Incorrect username or password', res);
      }
    }
  );
});

// Utility function
function createError(statusCode = 404, error, res) {
  res.status(statusCode).json({
    code: res.statusCode,
    error,
    response: null
  });
}

function createResponse(statusCode = 200, responseBody, res) {
  res.status(statusCode).json({
    code: res.statusCode,
    error: null,
    response: responseBody
  });
}

function findMarketAdminByUsernamePassword(username, password, callback) {
  const query =
    'SELECT market_admin_id FROM market_admins WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
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
    'SELECT merchant_id FROM merchants WHERE username = ? AND password = ?';
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

module.exports = router;
