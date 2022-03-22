const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');
const { coinGecko } = require('../service/index');

const CoinController = {
  async getCoinByCode(coinCode) {
    let coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');
    const price = await coinGecko.fetchCoinPrice(coinCode)

    return coin.filterKeys({ price });
  },
  async createCoin(coinObj) {
    const coin = await Models.Coin.upsert(coinObj);

    errors.assertExposable(coin, 'unknown_coin_code');

    return coin.filterKeys();
  }

};

module.exports = CoinController;
