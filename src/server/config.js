const config = {
  version: 'v' + require('../../package.json').version,
  port: parseInt(process.env.PORT) || 8191,
  host: process.env.HOST || '0.0.0.0',
  testUrl: process.env.TEST_URL || "http://www6.yggtorrent.lol",
  shareCookie: ('' + process.env.DISABLE_SHARE_COOKIE).toUpperCase() !== 'TRUE',
}

module.exports = config;
