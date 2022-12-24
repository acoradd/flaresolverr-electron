const sessionService = require("./service/session.service")

async function create(params, response) {
    const session = await sessionService.create();

    response.status = "ok";
    response.message = "Session created successfully.";
    response.session = session.sessionId;
}

async function list(params, response) {
  response.status = "ok";
  response.message = "";
  response.sessions = sessionService.list();
}

async function destroy(params, response) {

  sessionService.destroy(params.session);

  response.status = "ok";
  response.message = "The session has been removed.";
}

module.exports = {
  create,
  list,
  destroy
};
