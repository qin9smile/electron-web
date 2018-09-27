const { remote, ipcRenderer } = require("electron");

var nodeConsole = require("console");


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