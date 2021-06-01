const _ = require('lodash');
const TemperatureService = require('../../domain/services/temperature');

const handlers = {
  read: async (ctx) => {
    const { userId } = ctx.params;
    const { precision, period, date } = ctx.request.query;

    if (!userId || !precision || !period || !date) {
			return (ctx.status = 400);
		}

    try {
			await TemperatureService.getTemperature({
        userId,
        precision,
        period,
        date
      });
			ctx.status = 200;
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
  },
  create: async (ctx) => {
    const { userId } = ctx.params;
    const { temperature, timestamp } = ctx.request.body;

    if (!userId || _.isNil(temperature) || !timestamp) {
      return (ctx.status = 400);
    }

    try {
      await TemperatureService.addTemperature({
        userId,
        temperature,
        timestamp,
      });
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

module.exports = handlers;
