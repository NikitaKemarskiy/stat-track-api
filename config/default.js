module.exports = {
  db: {
    url: 'mongodb://127.0.0.1:27017/ts-bot'
  },
  server: {
    ssl: {
      keyPath: `<PATH>`,
      certPath: `<PATH>`,
      chainPath: `<PATH>`
    },
    httpPort: 80,
    httpsPort: 443,
    host: '<HOST>',
    cors: {
      credentials: true
    },
    sessionSecret: '<SESSION SECRET>'
  },
}