const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const { join } = require('path');

function createWindow() {
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, 'icons', 'icon.png')
    : join(__dirname, '..', 'resources', 'icons', 'icon.png');

  const appIcon = nativeImage.createFromPath(iconPath);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Notion",
    icon: appIcon,
    webPreferences: { nodeIntegration: true }
  });

  let tray = new Tray(appIcon);
  tray.setToolTip('Notion');

  const trayMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click: () => win.show() },
    { label: 'Sair', click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setContextMenu(trayMenu);

  tray.on('click', () => win.show());
  tray.on('right-click', () => tray.popUpContextMenu());

  win.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on('page-title-updated', (e) => e.preventDefault());
  win.removeMenu();
  win.loadURL('https://www.notion.so');
}

app.whenReady().then(createWindow);