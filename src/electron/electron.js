const {app, BrowserWindow} = require('electron');
const path = require('path');


app.on('window-all-closed', () => {
  app.quit();
})

async function editWindow(window) {

  window.webContents.setUserAgent(
    window.webContents.getUserAgent().split(' ')
      .filter(userAgentPart => {
        return !userAgentPart.toLowerCase().startsWith('flaresolverr')
          && !userAgentPart.toLowerCase().startsWith('electron')
      })
      .join(' ')
  );

  return window;
}

async function createWindow(withPreload = true) {

  await app.whenReady();

  return await editWindow(
    new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        preload: withPreload ? path.join(__dirname, 'preload.js') : undefined,
      }
    })
  );
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
