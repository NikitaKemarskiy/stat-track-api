const DB = require('./db');
const Server = require('./server');

async function main() {
  await DB.connect();
  await Server.init();
};

main();
