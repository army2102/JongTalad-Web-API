require('dotenv').config();

let CONFIG = {};

CONFIG.PORT = process.env.PORT || 3000;
CONFIG.JAWSDB_URL = process.env.JAWSDB_URL;

module.exports = CONFIG;
