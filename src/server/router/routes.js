const Routes = {
  isInit: false,
  init: function (router) {
    if (this.isInit) {
      return;
    }

    this.isInit = true;

    router.put('/api/orders', this.getAuthCheckedHandler(ordersHandlers.read));
  },
};

export default Routes;
