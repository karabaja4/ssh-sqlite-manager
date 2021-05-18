
const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 1200, 
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate(
    [
      {
        label: 'Query',
        submenu:
          [
            {
              label: 'ExecuteQuery',
              accelerator: 'Ctrl+E',
              click: () => { mainWindow.webContents.send('executeQuery'); }
            },
            {
              label: 'LoadTables',
              accelerator: 'Ctrl+T',
              click: () => { mainWindow.webContents.send('loadTables'); }
            }
          ]
      }
    ]);
  Menu.setApplicationMenu(menu);
  mainWindow.setMenuBarVisibility(false);
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
