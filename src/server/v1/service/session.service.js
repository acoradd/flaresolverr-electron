const {encrypt} = require('../../utils');
const electron = require('../../../electron/electron');

const activeWindows = new Map();
const activeWindowsId = new Map();

////////////// UTILS //////////////
function existById(id) {
  return activeWindows.has(id || '');
}

function getById(id) {
  return activeWindows.get(id || '');
}

function getByWindowId(id) {
  return activeWindowsId.get(id || '');
}

////////////// FONCTIONAL //////////////
async function create() {
  const window = await electron.createWindow(undefined, false);

  if (window) {
    const session = {
      sessionId: encrypt(`s${window.id}#${Date.now() % 1000}`),
      windowId: window.id,
      window: window
    }

    activeWindows.set(session.sessionId, session);
    activeWindowsId.set(session.windowId, session);

    window.on('close', (e) => {
      const sessionIdToClose = getByWindowId(e.sender.id).sessionId;
      activeWindowsId.delete(e.sender.id);
      activeWindows.delete(sessionIdToClose);
    });


    return session;

  } else {
    throw Error('Error creating session.')
  }
}

function list() {
  return Array.from(activeWindows.keys());
}

function destroy(id) {
  if (existById(id)) {
    getById(id).window.close();

  } else {
    throw Error('This session does not exist.')
  }
}

module.exports = {
  create,
  list,
  destroy,
  existById,
  getById,
  getByWindowId,
}
