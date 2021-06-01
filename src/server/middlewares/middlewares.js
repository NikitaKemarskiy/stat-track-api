const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const config = require('config');

const Middlewares = {
  isInit: false,
  init: function (app) {
    if (this.isInit) {
      return;
    }

    this.isInit = true;

    app.use(cors(config.server.cors));

    // Session secret key
    app.keys = [config.server.sessionSecret];

    // HTTPS middleware
    app.use(async (ctx, next) => {
      if (ctx.secure) {
        await next();
      } else {
        const httpsPath = `https://${ctx.host}${ctx.url}`;
        ctx.status = 308;
        ctx.redirect(httpsPath);
      }
    });

    app.use(bodyParser());

    console.log('=> [Server] Middlewares инициализированы');
  },
};

module.exports = Middlewares;
