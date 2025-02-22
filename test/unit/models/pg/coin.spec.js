const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const Models = require(path.join(srcDir, '/models/pg'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Model:coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    this.coin = await Models.Coin.findByPk('26a05507-0395-447a-bbbb-000000000000');
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  it('Should create', async () => {
    const coin = await Models.Coin.create({
      name: 'Bitcoin Cash',
      code: 'BCH',
    });

    expect(coin.name).to.eq('Bitcoin Cash');
    expect(coin.code).to.eq('BCH');
  });

  it('Should find by coinCode', async () => {
    const coinCode = this.coin.code;
    const coin = await Models.Coin.findByCoinCode(coinCode);

    expect(coin.id).to.eq(this.coin.id);
  });

  it('Should filterKeys', async () => {
    const coin = await Models.Coin.create({
      name: 'Amon',
      code: 'AMN',
    });

    const filterCoin = coin.filterKeys({ price: 4324 });
    expect(Object.keys(filterCoin).length).to.eq(3);
  });

  it('Should Put Coin', async () => {
    const obj = { name: 'Amon', code: 'AMN' };
    const coin = await Models.Coin.upsert(obj);

    expect(coin.name).to.eq(obj.name);
    expect(coin.code).to.eq(obj.code);
    await Models.Coin.upsert(obj);

    const AmnCoins = await Models.Coin.findAll({ where: { code: 'AMN' } });
    expect(Object.keys(AmnCoins).length).to.eq(1);
  });
});
