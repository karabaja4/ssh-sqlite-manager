
const { app, BrowserWindow, globalShortcut } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 600});
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  globalShortcut.register('Ctrl+E', () => {
    mainWindow.webContents.send('executeQuery');
  });
  globalShortcut.register('Ctrl+Shift+E', () => {
    mainWindow.webContents.send('loadTables');
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
})
