const Step = require('../entities/step');

const StepsService = {
	/** Create **/
	async addSteps(data) {
		return Step.create(data);
	},
};

export default StepsService;
