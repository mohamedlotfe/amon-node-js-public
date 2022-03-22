const { v4: uuid } = require('uuid');
const { pick } = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const Coin = sequelize.define(
    'Coin',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function (obj = {}) {
    const target = Object.assign(this.toObject(), obj)
    const filtered = pick(target, 'name', 'code', 'price');

    return filtered;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };
  Coin.upsert = function (values, tOpts = {}) {    // we can use upsert function instead of that
    return Coin
      .findOne(Object.assign({ where: { code: values.code } }, tOpts))
      .then(function (coinObj) {
        // update
        if (coinObj)
          return coinObj.update(values);
        // insert
        return Coin.create(values);
      })
  };
  return Coin;
};
