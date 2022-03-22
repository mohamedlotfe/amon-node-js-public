const moment = require('moment')
const { Op } = require('sequelize')
const constants = require('../../helpers/constants')

module.exports = (sequelize, Sequelize) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    crypto_currency: {
      type: Sequelize.ENUM(...constants.cryptoCurrency),
      allowNull: false
    },
    rates: {
      type: Sequelize.JSON,
      allowNull: false
    }
  }, {
    tableName: 'exchange_rates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  })
  ExchangeRate.findByCurrency = function (crypto_currency) {
    return ExchangeRate.findOne({
      where: {
        crypto_currency,
        created_at: {
          [Op.gte]: moment().subtract(1, 'hours')
        }
      }, order: [['created_at', 'DESC']]
    });
  };
  ExchangeRate.creat = function (crypto_currency, rates, tOpts = {}) {
    return ExchangeRate.create(Object.assign({ crypto_currency, rates }, tOpts));
  };
  return ExchangeRate
}
