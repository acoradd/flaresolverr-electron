const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const {port: serverPort, host: serverHost} = require('./config')


server.use(
  bodyParser.json({
    limit: '50mb',
    verify(req, res, buf) {
      req.body = buf;
    }
  })
);

function start() {
  return new Promise((resolve) => {
    server.listen(serverPort, () => {
      resolve({port: serverPort, host: serverHost});
    });
  })

}

module.exports = {server, start};


require('./v1');
