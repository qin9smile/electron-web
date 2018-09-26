const path = require("path");
const fs = require("fs");
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const electron = require("electron");
const appMenu = require("./main/menu");
const { app, ipcMain } = electron;

let force_quit = false;
let mainWindow;
let badgeCount;

const mainURL = `file://${path.join(__dirname, './index.html')}`;
const loadingURL = `file://${path.join(__dirname, './preloading.html')}`;

function createwin() {
  const win = new electron.BrowserWindow({
    title: "数据控制台",
    width: 1024,
    height: 728,
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./main/preload.js"),
    }
  });

  win.on("focus", () => {
    win.webContents.send("focus");
  });

  win.on("ready-to-show", () => {
    console.log("ready-to-show");
  });

  win.loadURL(mainURL);

  win.on("close", (event) => {
    if (!force_quit) {
      event.preventDefault();

      if (process.platform === "darwin") {
        app.hide();
      } else {
        win.hide();
      }
    }
  });

  /// win.setTitle("佳格控制台");

  win.on("enter-full-screen", () => {
    win.webContents.send("enter-fullscreen");
  });

  win.on("leave-full-screen", () => {
    win.webContents.send("leave-fullscreen");
  });

  win.webContents.on("will-navigate", (event) => {
    if (event) {
      win.webContents.send("destroytray");
    }
  });

  return win;
}

/// decrease load on gpu (experimental)
app.disableHardwareAcceleration();

// Temporary fix for Electron render colors differently
// More info here - https://github.com/electron/electron/issues/10732
app.commandLine.appendSwitch("force-color-profile", "srgb");

app.on("before-quit", () => {
  force_quit = true;
})

app.on("ready", () => {
  appMenu.setMenu({
    tabs: []
  });

  console.log("process.env.platform = ", process.platform);
  let loadingWindow;
  if (process.platform === "darwin") {
    loadingWindow = new electron.BrowserWindow({ show: false, frame: false, resizable: false });
  } else {
    loadingWindow = new electron.BrowserWindow({ show: false, frame: false, resizable: false });
  }
  loadingWindow.setResizable(false);
  loadingWindow.once("ready-to-show", () => {
    console.log("ready-to-show..");
    loadingWindow.show();
  });

  console.log("loadingwindow");

  loadingWindow.once("show", () => {
    mainWindow = createwin();

    const page = mainWindow.webContents;

    page.on("dom-ready", () => {
    });

    page.once("did-finish-load", () => {
      console.log("did finish load");
      mainWindow.show();
      mainWindow.focus();
      loadingWindow.hide();
      loadingWindow.close();

      if (process.env.NODE_ENV === "development") {
        mainWindow.openDevTools();
      }
      // TODO: - updater
    });


    ipcMain.on('focus-app', () => {
      mainWindow.show();
    });

    ipcMain.on("quit-app", () => {
      app.quit();
    });

    ipcMain.on("reload-full-app", () => {
      mainWindow.reload();
      page.send("destroytray");
    });

    ipcMain.on("clear-app-settings", () => {
      app.relaunch();
      app.exit();
    });

    ipcMain.on('toggle-app', () => {
      if (!mainWindow.isVisible() || mainWindow.isMinimized()) {
        mainWindow.show();
      } else {
        mainWindow.hide();
      }
    });

    ipcMain.on('toggle-badge-option', () => {
      // BadgeSettings.updateBadge(badgeCount, mainWindow);
    });

    ipcMain.on('update-badge', (event, messageCount) => {
      badgeCount = messageCount;
      // BadgeSettings.updateBadge(badgeCount, mainWindow);
      page.send('tray', messageCount);
    });

    ipcMain.on('forward-message', (event, listener, ...params) => {
      page.send(listener, ...params);
    });

    ipcMain.on('update-menu', (event, props) => {
      appMenu.setMenu(props);
    });

    ipcMain.on("set-badge-count", (event, args) => {
      console.log("send to main process", event, args);
      ipcMain.send("tray", args);
    });

    process.on("uncaughtException", (err) => {
      console.log("error", err);
    })
  });

  loadingWindow.loadURL(loadingURL);
});

app.on("uncaughtException", (error) => {
  console.log(err);
  console.log(err.stack);
})
