const {} = require('../config');
const sessionService = require('./service/session.service');
const solverService = require('./service/solver.service');

async function get(params, response) {
  params.method = 'GET';

  checkParams(params);

  await windowRequest(params, response);
}

async function post(params, response) {
  params.method = 'POST';

  checkParams(params);

  await windowRequest(params, response);
}


async function windowRequest(params, response) {

  const result = await executeRequest(params);

  response.status = result.status;
  response.message = result.message;
  response.solution = result.result;

  if (response.message) {
    console.info(response.message)
  }
}

async function executeRequest(params) {
  const oneTimeSession = params.session === undefined;

  const session = oneTimeSession
    ? await sessionService.create()
    : sessionService.getById(params.session)

  if (!session) {
    throw Error('This session does not exist. Use \'list_sessions\' to see all the existing sessions.')
  }

  try {
    return await solverService.resolveChallenge(params, session)
  } catch (error) {
    throw Error("Unable to process browser request. " + error)
  } finally {
    if (oneTimeSession) {
      await sessionService.destroy(session.sessionId)
    }
  }

}

function checkParams(params) {

  // postData only supports for POST
  if (!params.postData === (params.method === 'POST')) {
    throw Error('Cannot use "postData" when sending a GET request.')
  }
  if (params.returnRawHtml) {
    console.warn("Request parameter 'returnRawHtml' was removed in FlareSolverr v2.")
  }
  if (params.download) {
    console.warn("Request parameter 'download' was removed in FlareSolverr v2.")
  }
}



module.exports = {
  get,
  post
};
