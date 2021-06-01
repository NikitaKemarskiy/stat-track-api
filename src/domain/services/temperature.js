const moment = require('moment');
const Temperature = require('../entities/temperature');
const { getTimeStepUnitByPrecision, getDateRangeByPeriodAndDate } = require('../../helpers');

function getTemperatureByPrecision({
  temperature,
  precision,
  start,
}) {
  const timeStepUnit = getTimeStepUnitByPrecision(precision);

  return temperature.reduce((accum, temperature) => {
    let mNext = moment(accum.current).add(1, timeStepUnit);
    let mTimestamp = moment(temperature.timestamp);

    if (mTimestamp.isBefore(mNext)) {
      accum.temperatureByPrecision[accum.temperatureByPrecision.length - 1].push(temperature.temperature);
    } else {
      accum.current = mNext.toDate();
      accum.temperatureByPrecision.push([temperature.temperature]);
    }
  }, {
    temperatureByPrecision: [[]],
    current: new Date(start),
  })
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

    const temperature = await Temperature.find(filter).sort({ timestamp: -1 });

    return getTemperatureByPrecision({
      temperature,
      precision,
      start,
    });
  },

	/** Create **/
	async addTemperature(data) {
		return Temperature.create(data);
	},
};

module.exports = TemperatureService;
