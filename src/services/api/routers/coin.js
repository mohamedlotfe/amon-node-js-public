const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),
  schemaCreateCoin: Joi.object({
    code: Joi.string().min(3).uppercase().max(5).required(), // a required string
    name: Joi.string().min(3).max(20).required(), // a required string
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },
  async createCoin(ctx) {
    const body = {
      code: ctx.request.body.coinCode,
      name: ctx.request.body.coinName,
    };
    const formattedBody = await validateParams(CoinRouter.schemaCreateCoin, body);

    ctx.body = await CoinController.createCoin(formattedBody);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Status
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);
    /**
     * @api {put} / Put createCoin
     * @apiName createCoin
     * @apiGroup Status
     * @apiDescription Put createCoin
     *
     * @apiSampleRequest /
     *
     */
    router.put('/createCoin', CoinRouter.createCoin);

    return router;
  },
};

module.exports = CoinRouter;
