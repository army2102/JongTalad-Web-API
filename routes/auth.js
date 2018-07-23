const express = require('express');

const router = express.Router();

const utility = require('../utility');
const connection = require('./connect');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Auth route' });
});

// Market admin authentication
router.post('/register/marketadmin', (req, res) => {
  const {
    marketAdminName,
    marketAdminSurname,
    marketAdminPhonenumber,
    marketName,
    marketAddress
  } = req.body;
  createMarketAdmin(
    { marketAdminName, marketAdminSurname, marketAdminPhonenumber },
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      } else {
        const marketAdminId = results.insertId;
        createMarket(
          { marketName, marketAddress },
          (error, results, fields) => {
            if (error) {
              utility.createError(404, error, res);
            } else {
              const marketId = results.insertId;
              assignMarketAdminToMarket(
                { marketId, marketAdminId },
                (error, results, fields) => {
                  if (error) {
                    utility.createError(404, error, res);
                  } else {
                    utility.createResponse(
                      201,
                      {
                        marketId,
                        marketAdminId
                      },
                      res
                    );
                  }
                }
              );
            }
          }
        );
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
  const {
    merchantName,
    merchantSurname,
    merchantPhonenumber,
    merchantIdCard,
    username,
    password
  } = req.body;
  findMerchantByUsernamePassword(
    username,
    password,
    (error, results, fields) => {
      if (error) {
        utility.createError(404, error, res);
      }
      if (results.length === 0) {
        createMerchant(
          {
            merchantName,
            merchantSurname,
            merchantPhonenumber,
            merchantIdCard,
            username,
            password
          },
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

function createMarketAdmin(
  { marketAdminName, marketAdminSurname, marketAdminPhonenumber },
  callback
) {
  const query =
    'INSERT INTO market_admins (name, surname, phonenumber) VALUES (?, ?, ?)';
  connection.query(
    query,
    [marketAdminName, marketAdminSurname, marketAdminPhonenumber],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function createMarket({ marketName, marketAddress }, callback) {
  const query =
    'INSERT INTO markets (name, address, verified) VALUES (?, ?, 0)';
  connection.query(
    query,
    [marketName, marketAddress],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function assignMarketAdminToMarket({ marketId, marketAdminId }, callback) {
  const query =
    'INSERT INTO  market_admin_markets (market_id, market_admin_id) VALUES (?, ?)';
  connection.query(
    query,
    [marketId, marketAdminId],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

function findMerchantByUsernamePassword(username, password, callback) {
  const query =
    'SELECT merchant_id AS merchantId FROM merchants WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results, fields) => {
    callback(error, results, fields);
  });
}

function createMerchant(
  {
    merchantName,
    merchantSurname,
    merchantPhonenumber,
    merchantIdCard,
    username,
    password
  },
  callback
) {
  const query = `INSERT INTO merchants (name, surname, phonenumber, id_card, username, password) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      merchantName,
      merchantSurname,
      merchantPhonenumber,
      merchantIdCard,
      username,
      password
    ],
    (error, results, fields) => {
      callback(error, results, fields);
    }
  );
}

module.exports = router;
