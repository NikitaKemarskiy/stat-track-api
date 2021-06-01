const KoaRouter = require('@koa/router');
const routes = require('./routes');

const Router = {
  router: null,
  init: function (app) {
    if (this.router) {
      return;
    }

    this.router = new KoaRouter();

    routes.init(this.router);

    app.use(this.router.routes());

    console.log('=> [Server] Роутер инициализирован');
  },
};

module.exports = Router;
