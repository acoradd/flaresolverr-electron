const {version, logRequestCookie} = require('../config');

const {server} = require('../server');

const session = require('./session');
const request = require('./request');


const commands = {
  'sessions.create': session.create,
  'sessions.list': session.list,
  'sessions.destroy': session.destroy,
  'request.get': request.get,
  'request.post': request.post,
}

let nbRequest = 0;
function incRequestAndGet() {
  return nbRequest++;
}

server.post('/v1',  async (req, res) => {
  const params = req.body;
  const numRequest = incRequestAndGet();

  const response = {
    status: null,
    message: null,
    startTimestamp: Date.now(),
    endTimestamp: 0,
    version: version
  }

  try {
    checkParams(params);

    console.info(`Request [${numRequest}] : CMD="${params.cmd}"URL="${params.url}",TIMEOUT="${params.maxTimeout}",ONLY_COOKIE=${params.returnOnlyCookies} |`, logRequestCookie ? params.cookies : null);

    await executeCommand(params, response);

  } catch (e) {
    console.error(e);
    res.status(500);
    response.status = "error";
    response.message = e.toString();
  }

  response.endTimestamp = Date.now();
  console.info(`Request [${numRequest}] - Response in ${(response.endTimestamp - response.startTimestamp) / 1000} s`);
  res.send(response);
})

function checkParams(params) {
  if (!params.cmd) {
    throw Error("Request parameter 'cmd' is mandatory.")
  }
  if (params.headers) {
    console.warn("Request parameter 'headers' was removed in FlareSolverr v2.")
  }
  if (params.userAgent) {
    console.warn("Request parameter 'userAgent' was removed in FlareSolverr v2.")
  }
}

async function executeCommand(params, response) {
  const command = commands[params.cmd];
  if (command) {
    await command(params, response);
  } else {
    throw Error(`The command '${params.cmd}' is invalid.`)
  }
}
