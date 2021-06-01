const stepsHandlers = require('../handlers/steps');
const temperatureHandlers = require('../handlers/temperature');

const Routes = {
  isInit: false,
  init: function (router) {
    if (this.isInit) {
      return;
    }

    this.isInit = true;

    /*** Steps ***/
    router.get('/steps/:userId', stepsHandlers.read);
    router.put('/steps/:userId', stepsHandlers.create);

    /*** Temperature ***/
    router.get('/temperature/:userId', temperatureHandlers.read);
    router.put('/temperature/:userId', temperatureHandlers.create);
  },
};

module.exports = Routes;
