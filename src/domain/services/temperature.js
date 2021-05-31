const Temperature = require('../entities/temperature');

const TemperatureService = {
	/** Create **/
	async addTemperature(data) {
		return Temperature.create(data);
	},
};

export default TemperatureService;
