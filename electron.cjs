// Import Electron modules in CommonJS style
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the built Vite app (dist folder)
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Optional: Open DevTools for debugging
  // win.webContents.openDevTools();
}

// Create the window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except Mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
