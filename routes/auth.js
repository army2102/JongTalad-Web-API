const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const CONFIG = require('../config/config');

function getConnection() {
  return mysql.createConnection(CONFIG.JAWSDB_URL);
}

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
router.post('/register/marketadmin', (req, res) => {
  const { username, password } = req.body;

  const connection = getConnection();
  const query = 'INSERT INTO ';
  connection.query('');

  res.end(`Register with Username: ${username} Password: ${password}`);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.end(`Login with Username: ${username} Password: ${password}`);
});

// Utility function
function createError(statusCode = 404, error, res) {
  res.status(404).json({ code: statusCode, error, response: null });
}

function createResponse(statusCode = 200, responseBody, res) {
  res.status(statusCode).json({
    code: res.statusCode,
    error: null,
    response: responseBody
  });
}

function findMarketAdminByUsernamePassword(username, password, callback) {
  const connection = getConnection();
  const query =
    'SELECT market_admin_id FROM market_admins WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
    connection.end();
    callback(error, results, fields);
  });
}

function createMarketAdmin(username, password, callback) {
  const connection = getConnection();
  const query = 'INSERT INTO market_admins (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (error, results, fields) => {
    connection.end();
    callback(error, results, fields);
  });
}

module.exports = router;
