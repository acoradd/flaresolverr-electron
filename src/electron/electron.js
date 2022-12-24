const {app, BrowserWindow} = require('electron');
const path = require('path');
const {shareCookie} = require('../server/config');


app.on('window-all-closed', () => {
  app.quit();
})

async function createWindow(withPreload = true) {

  await app.whenReady();

  return new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: withPreload ? path.join(__dirname, 'preload.js') : undefined,
      partition: shareCookie ? undefined : `${Date.now()}`
    }
  });
}

async function createWindowAndNavigateToUrl(url) {
  const window = await createWindow(true);

  if (url) {
    await window.loadURL(url);
  }

  return window;
}

async function createWindowAndNavigateToResource(resourcePath) {
  const window = await createWindow(true);

  if (resourcePath) {
    await window.loadFile(path.join(__dirname, '../../resources/', resourcePath))
  }

  return window;
}

async function createWindowWhenAppReady(url, wait) {

  const window = await createWindowAndNavigateToUrl(url);

  return new Promise((resolve) => {
    setTimeout(() => resolve(window), wait ? 5000 : 1);
  });
}

function startApp(filePath) {
  return createWindowAndNavigateToResource(filePath);
}

module.exports = {
  app,
  createWindow: createWindowWhenAppReady,
  startApp: startApp
};
