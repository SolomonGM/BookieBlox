const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/renderer.js'),
      nodeIntegration: true
    
    }
  });

  mainWindow.loadFile('src/BoxDrop.html');
}

app.whenReady().then(() => {
  createWindow();

  // Start the Express server
  const server = spawn('node', [path.join(__dirname, 'src', 'js', 'Server', 'server.js')]);

  server.stdout.on('data', (data) => {
    console.log(`Server stdout: ${data}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server stderr: ${data}`);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
