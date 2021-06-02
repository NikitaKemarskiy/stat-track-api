const moment = require('moment');
const Temperature = require('../entities/temperature');
const { getTimeStepUnitByPrecision, getDateRangeByPeriodAndDate } = require('../../helpers');

function getTemperatureByPrecision({
  temperature,
  precision,
  start,
}) {
  const timeStepUnit = getTimeStepUnitByPrecision(precision);

  const { temperatureByPrecision } = temperature.reduce((accum, temperature) => {
    let mNext = moment(accum.current).add(1, timeStepUnit);
    let mTimestamp = moment(temperature.timestamp);

    while (mTimestamp.isSameOrAfter(mNext)) {
      accum.temperatureByPrecision.push([]);
      accum.current = mNext.toDate();
      mNext.add(1, timeStepUnit);
    }

    accum.temperatureByPrecision[accum.temperatureByPrecision.length - 1].push(temperature.temperature);

    return accum;
  }, {
    temperatureByPrecision: [[]],
    current: new Date(start),
  });

  return temperatureByPrecision.map(
    (items) => items.reduce((accum, item) => accum + item, 0) / items.length,
  );
}

const TemperatureService = {
  /** Read **/
  async getTemperature({
    userId,
    precision,
    period,
    date
  }) {
    const { start, end } = getDateRangeByPeriodAndDate(period, date);

    const filter = {
      userId,
      timestamp: {
        $gte: start,
        $lte: end,
      },
    };

    const temperature = await Temperature.find(filter).sort({ timestamp: 1 });

    return getTemperatureByPrecision({
      temperature,
      precision,
      start,
    });
  },

  async getTemperatureSummary({
    userId,
    period,
    date
  }) {
    const { start, end } = getDateRangeByPeriodAndDate(period, date);

    const filter = {
      userId,
      timestamp: {
        $gte: start,
        $lte: end,
      },
    };

    const temperature = await Temperature.find(filter);

    const summary = temperature.reduce((accum, { temperature }) => {
      accum.minTemperature = accum.min && accum.min < temperature
        ? accum.min
        : temperature;
      accum.maxTemperature = accum.max && accum.max > temperature
        ? accum.max
        : temperature;
      accum.avgTemperature = (accum.avg || 0) + temperature;

      return accum;
    }, {});
  
    summary.avg /= temperature.length;

    return summary;
  },

	/** Create **/
	async addTemperature(data) {
		return Temperature.create(data);
	},
};

module.exports = TemperatureService;
