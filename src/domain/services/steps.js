const moment = require('moment');
const Step = require('../entities/step');
const { getTimeStepUnitByPrecision, getDateRangeByPeriodAndDate } = require('../../helpers');

function getStepsByPrecision({
  steps,
  precision,
  start,
  end
}) {
  const timeStepUnit = getTimeStepUnitByPrecision(precision);

  const { stepsByPrecision } = steps.reduce((accum, step) => {
    let mFrom = moment(step.from);
    let mTill = moment(step.till);
    let mCurrent = moment(accum.current);

    if (mFrom.isBefore(mCurrent)) {
      step.stepsAmount *= (1 - mCurrent.diff(mFrom) / mTill.diff(mFrom));
      mFrom = moment(accum.current);
    }

    while (!mFrom.isSame(mTill) && mCurrent.isBefore(end)) {
      const mNext = moment(mCurrent).add(1, timeStepUnit);

      if (mTill.isSameOrAfter(mNext)) {
        const stepsAmountPart = step.stepsAmount * (mNext.diff(mFrom) / mTill.diff(mFrom));
        accum.stepsByPrecision[accum.stepsByPrecision.length - 1] += stepsAmountPart;

        step.stepsAmount -= stepsAmountPart;
        mFrom = moment(mNext);
        mCurrent = moment(mNext);

        accum.stepsByPrecision.push(0);
      } else {
        accum.stepsByPrecision[accum.stepsByPrecision.length - 1] += steps.stepsAmount;
        mFrom = moment(mTill);
      }
    }

    accum.current = mCurrent.toDate();

    return accum;
  }, {
    stepsByPrecision: [0],
    current: new Date(start),
  });

  return stepsByPrecision;
}

const StepsService = {
  /** Read **/
  async getSteps({
    userId,
    precision,
    period,
    date
  }) {
    const { start, end } = getDateRangeByPeriodAndDate(period, date);

    const filter = {
      userId,
      $or: [{
        from: { $gte: start }
      }, {
        till: { $gte: start }
      }],
      $or: [{
        from: { $lte: end }
      }, {
        till: { $lte: end }
      }],
    };

    const steps = await Step.find(filter).sort({ from: 1 });

    const [firstStep] = steps;
    const [lastStep] = steps.slice(-1);

    if (moment(firstStep.from).isBefore(start)) {
      firstStep.stepsAmount *= (
        1 - moment(start).diff(firstStep.from) / moment(firstStep.till).diff(firstStep.from)
      );
      firstStep.from = new Date(start);
    }

    if (moment(lastStep.till).isAfter(end)) {
      lastStep.stepsAmount *= (
        1 - moment(lastStep.till).diff(end) / moment(lastStep.till).diff(moment(lastStep.from))
      );
      lastStep.till = new Date(end);
    }

    return getStepsByPrecision({
      steps,
      precision,
      start,
      end,
    });
  },

	/** Create **/
	async addSteps(data) {
		return Step.create(data);
	},
};

module.exports = StepsService;
