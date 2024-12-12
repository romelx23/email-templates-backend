const { config } = require('./../config/config');
const {pg} = require('pg');

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'postgres',
  },
  production: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
