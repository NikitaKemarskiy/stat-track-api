const fs = require('fs');
const util = require('util');
const http = require('http');
const https = require('https');
const Koa = require('koa');
const middlewares = require('./middlewares/middlewares');
const router = require('./router/router');

const config = require('config');

const SSL = {
  key: fs.readFileSync(config.server.ssl.keyPath),
  cert: fs.readFileSync(config.server.ssl.certPath),
  ca: fs.readFileSync(config.server.ssl.chainPath),
};

const Server = {
  app: null,
  httpURL: null,
  httpsURL: null,
  getUrl: function (path) {
    return this.httpsURL + '/' + path;
  },
  init: async function () {
    if (this.app) {
      return;
    }

    this.app = new Koa();

    middlewares.init(this.app);
    router.init(this.app);

    const httpServer = http.createServer(this.app.callback());
    const httpsServer = https.createServer(SSL, this.app.callback());

    const { httpPort, httpsPort, host } = config.server;

    try {
      //@ts-ignore
      await util.promisify(httpServer.listen).call(httpServer, httpPort);
      //@ts-ignore
      await util.promisify(httpsServer.listen).call(httpsServer, httpsPort);

      this.httpURL = `http://${host}:${httpPort}`;
      this.httpsURL = `https://${host}:${httpsPort}`;

      console.log(`=> [Server] Сервер инициализирован, слушает на ${this.httpsURL}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
};

export default Server;
