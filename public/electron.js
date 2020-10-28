const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const findFiles = require('./cmp/ItemSearch');

console.log(findFiles)

const fs = require('fs');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const { dialog } = electron;

let mainWindow;
let projectWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 600, height: 340, webPreferences: { nodeIntegration: true }, resizable: false});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);

  projectWindow = new BrowserWindow({width: 900, height: 680,  show: false, webPreferences: { nodeIntegration: true }});
  projectWindow.loadURL(isDev ? 'http://localhost:3000/project' : `file://${path.join(__dirname, '../build/index.html')}`);
  projectWindow.on('close', (e) => {
    e.preventDefault();
    projectWindow.hide();
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

async function openDirectory(e, arg) {
  // { canceled: true, filePaths: [] }
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if(!result.canceled) {
    
    const res = fs.readdirSync(result.filePaths[0]);
    if(!res.filter(e => e === "package.json")[0]){
      return;
    }
    const projectResults = JSON.parse(fs.readFileSync(result.filePaths[0] + "/package.json"));

    projectWindow.show();
    mainWindow.hide();
    projectWindow.title = projectResults.name;
    projectWindow.send('projectName', {name: projectResults.name, dependencies: projectResults.dependencies});
    // Load project in
    const response = await findFiles(result.filePaths[0]);
    projectWindow.send('addElements', response)
  }
}

ipcMain.on('openDir', openDirectory);