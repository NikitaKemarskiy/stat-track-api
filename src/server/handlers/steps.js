const _ = require('lodash');
const StepsService = require('../../domain/services/steps');

const handlers = {
  read: async (ctx) => {
    const { userId } = ctx.params;
    const { precision, period, date } = ctx.request.query;

    if (!userId || !precision || !period || !date) {
			return (ctx.status = 400);
		}

    try {
			const steps = await StepsService.getSteps({
        userId,
        precision: parseInt(precision),
        period: parseInt(period),
        date: parseInt(date),
      });

			ctx.status = 200;
      ctx.body = {
        steps,
      };
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
  },
	create: async (ctx) => {
    const { userId } = ctx.params;
    const { stepsAmount, from, till } = ctx.request.body;

    if (!userId || _.isNil(stepsAmount) || !from || !till) {
			return (ctx.status = 400);
		}

		try {
			await StepsService.addSteps({
        userId,
        stepsAmount,
        from,
        till,
      });
			ctx.status = 200;
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
	},
  readSummary: async (ctx) => {
    const { userId } = ctx.params;
    const { period, date } = ctx.request.query;

    if (!userId || !period || !date) {
			return (ctx.status = 400);
		}

    try {
			const stepsSummary = await StepsService.getStepsSummary({
        userId,
        period: parseInt(period),
        date: parseInt(date),
      });

			ctx.status = 200;
      ctx.body = stepsSummary;
		} catch (err) {
			console.error(err);
			ctx.status = 500;
		}
  },
};

module.exports = handlers;
