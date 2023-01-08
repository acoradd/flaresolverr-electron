const config = {
  version: 'v' + require('../../package.json').version,
  port: parseInt(process.env.PORT) || 8191,
  host: process.env.HOST || '0.0.0.0',
  testUrl: process.env.TEST_URL || "https://google.com",
  logRequestCookie: ('' + process.env.DISABLE_LOG_COOKIE).toUpperCase() !== 'TRUE',
}

module.exports = config;
