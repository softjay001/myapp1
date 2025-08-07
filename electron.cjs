const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let serverProcess;

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation is true by default and recommended for security.
      // If you need to expose node modules to the renderer, you should use a preload script.
      // For this case, since nodeIntegration is true, contextIsolation should be false.
      contextIsolation: false
    }
  });

  // Start the server
  const serverPath = path.join(__dirname, 'dist/index.js');
  serverProcess = fork(serverPath, [], {
    env: { ...process.env, NODE_ENV: 'production' },
    silent: true // Pipe stdout/stderr to parent
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`server stdout: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`server stderr: ${data}`);
  });

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  // Give the server some time to start before loading the URL
  // A more robust solution would be to wait for a message from the server process
  setTimeout(() => {
    win.loadFile(path.join(__dirname, 'dist/client/index.html'));
  }, 5000); // 5 second delay, to be safe
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Kill the server process when the app is about to quit
  if (serverProcess) {
    console.log('Killing server process');
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
