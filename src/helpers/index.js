const moment = require('moment');
const StatsPeriod = require('../enum/statsPeriod');
const StatsPrecision = require('../enum/statsPrecision');

function getPeriodStringMoment(period) {
  switch (period) {
    case StatsPeriod.BY_DAY: {
      return 'day';
    }
    case StatsPeriod.BY_WEEK: {
      return 'isoWeek';
    }
    case StatsPeriod.BY_MONTH: {
      return 'month';
    }
    case StatsPeriod.BY_YEAR: {
      return 'year';
    }
  }
}

function getTimeStepUnitByPrecision(precision) {
  switch (precision) {
    case StatsPrecision.HOUR: {
      return 'hours';
    }
    case StatsPrecision.DAY: {
      return 'days';
    }
    case StatsPrecision.MONTH: {
      return 'monthe';
    }
  }
}

function getDateRangeByPeriodAndDate(period, date) {
  const periodString = getPeriodStringMoment(period);

  const start = moment(date).startOf(periodString).toDate();
  const end = moment(date).endOf(periodString).toDate();

  return {
    start,
    end,
  }
}

module.exports = {
  getTimeStepUnitByPrecision,
  getDateRangeByPeriodAndDate,
};