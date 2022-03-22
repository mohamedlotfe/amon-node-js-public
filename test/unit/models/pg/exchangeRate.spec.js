const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const Models = require(path.join(srcDir, '/models/pg'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Model:ExchangeRate', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/exchangeRate.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.exchangeRate = await Models.ExchangeRate.findByPk('baa53743-f4dc-4247-b13a-af0c7ce74081');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('Should create', async () => {
    const exchangeRate = await Models.ExchangeRate.create({
      crypto_currency: 'BTC',
      rates: { EUR: 34060.24, GBP: 29003.69, USD: 40263.0 },
    });

    expect(exchangeRate.crypto_currency).to.eq('BTC');
    expect(exchangeRate.rates).to.be.a('object');
  });
  it('Should find by currency', async () => {
    const { crypto_currency } = this.exchangeRate;
    const exchangeRate = await Models.ExchangeRate.findByCurrency(crypto_currency);
    console.log('crypto_currency', crypto_currency, exchangeRate);

    expect(exchangeRate.rates).to.be.a('object');
  });
});
