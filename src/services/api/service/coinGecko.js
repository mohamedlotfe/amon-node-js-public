/* eslint-disable node/no-unpublished-require */
const CoinGecko = require('coingecko-api');
const Models = require('../../../models/pg');
const { cryptoIds } = require('../../../helpers/constants');

const CoinGeckoClient = new CoinGecko();

const formateRates = (data, coindId) =>
  Object.entries(data[coindId]).reduce((a, [symbol, rate]) => {
    a[symbol.toUpperCase()] = rate;
    return a;
  }, {});

const fetchCoinPrice = async (coinCode, currency = 'USD') => {
  const { rates } = (await Models.ExchangeRate.findByCurrency(coinCode)) || {};
  if (rates) {
    const coinRate = JSON.parse(rates);
    return coinRate[currency];
  }

  const coindId = cryptoIds[coinCode];
  if (!coindId) {
    throw new Error('coin Id not exist');
  }

  const { data } = (await CoinGeckoClient.simple.price({ ids: [coindId], vs_currencies: ['usd', 'eur', 'gbp'] })) || {};

  if (data && data[coindId]) {
    const rates = formateRates(data, coindId);

    await Models.ExchangeRate.creat(coinCode, JSON.stringify(rates));

    return rates[currency];
  }
  return 0;
};
module.exports = { fetchCoinPrice };
