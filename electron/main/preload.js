const { remote, ipcRenderer } = require("electron");

var nodeConsole = require("console");

ipcRenderer.on('redirect-url', function(event, url) {
  window.location.assign(url);
});

ipcRenderer.on("reload-current-viewer", function(event, url) {
  console.log("preload");
  window.location.href = window.location.href;
});

window.interop = {
  setBadgeCount(count) {
    ipcRenderer.send("update-badge", 15);
    // return remote.app.setBadgeCount(count);
  },

  openNewTab(url) {
    remote.shell.openExternal(url);
  },

  redirectURL(url) {
    console.log(url);
    // window.location.assign(url);
  }
}