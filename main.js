const electron = require('./src/electron/electron');
const server = require('./src/server');
const {testUrl} = require("./src/server/config");


const electronEmptyWindowsPromise = electron.startApp("index.html");
const electronTestWindowsPromise = electron.createWindow(testUrl, true);
const serverStartPromise = server.start();

Promise.all([electronEmptyWindowsPromise, electronTestWindowsPromise, serverStartPromise])
  .then(([, electronWindows, serverConfig]) => {
    console.info(`Listening on http://${serverConfig.host}:${serverConfig.port}`);

    console.info(`Navigate successfully to ${testUrl}`);

    // Automatically close window used by server to test internet connection
    electronWindows.close();
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
