const moment = require('moment');
const Step = require('../entities/step');
const { getTimeStepUnitByPrecision, getDateRangeByPeriodAndDate } = require('../../helpers');

const METERS_IN_STEP = 0.762;

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

      if (mFrom.isBefore(mNext) && mTill.isSameOrAfter(mNext)) {
        const stepsAmountPart = step.stepsAmount * (mNext.diff(mFrom) / mTill.diff(mFrom));
        accum.stepsByPrecision[accum.stepsByPrecision.length - 1] += stepsAmountPart;

        step.stepsAmount -= stepsAmountPart;
        mFrom = moment(mNext);
        mCurrent = moment(mNext);

        accum.stepsByPrecision.push(0);
      } else if (mFrom.isBefore(mNext)) {
        accum.stepsByPrecision[accum.stepsByPrecision.length - 1] += step.stepsAmount;
        mFrom = moment(mTill);
      } else {
        accum.stepsByPrecision.push(0);
        mCurrent = moment(mNext);
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

function getDistanceFromStepsInKilometers(steps) {
  return steps * METERS_IN_STEP / 1e3;
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

  async getStepsSummary({
    userId,
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

    const steps = await Step.find(filter);

    const summary = steps.reduce((accum, step) => {
      let mFrom = moment(step.from);
      let mTill = moment(step.till);
      let mStart = moment(start);
      let mEnd = moment(end);

      const speedKilometersPerHour = getDistanceFromStepsInKilometers(step.stepsAmount)
        / moment.duration(mTill.diff(mFrom)).asHours();

      accum.maxSpeed = accum.maxSpeed && accum.maxSpeed > speedKilometersPerHour
        ? accum.maxSpeed
        : speedKilometersPerHour;
      accum.avgSpeed = (accum.avgSpeed || 0) + speedKilometersPerHour;

      if (mFrom.isBefore(start)) {
        step.stepsAmount *= (1 - mStart.diff(mFrom) / mTill.diff(mFrom));
        mFrom = moment(start);
      }

      if (mTill.isAfter(end)) {
        step.stepsAmount *= (1 - mTill.diff(mEnd) / mTill.diff(mFrom));
        mTill = moment(end);
      }

      accum.distance = (accum.distance || 0) + getDistanceFromStepsInKilometers(step.stepsAmount);
  
      return accum;
    }, {});

    summary.avgSpeed /= steps.length;

    return summary;
  },

	/** Create **/
	async addSteps(data) {
		return Step.create(data);
	},
};

module.exports = StepsService;
