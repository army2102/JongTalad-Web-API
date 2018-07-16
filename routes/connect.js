const mysql = require('mysql');

const CONFIG = require('../config/config');

module.exports = mysql.createPool(CONFIG.JAWSDB_URL);
