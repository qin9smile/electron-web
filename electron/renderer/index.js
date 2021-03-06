const { remote, ipcRenderer } = require("electron");
const { AppContext } = require("../../src/base/appcontext");

//------------------ Router -------------------

ipcRenderer.on("back", function(event, url) {
  AppContext.history().goBack();
});

ipcRenderer.on("forward", function(event, url) {
  AppContext.history().goForward();
});

ipcRenderer.on("go", function(event, n) {
  AppContext.history().go(n);
});

ipcRenderer.on("push", function(event, url) {
  AppContext.history().push(url);
});

ipcRenderer.on("replace", function(event, url) {
  AppContext.history().replace(url);
});

ipcRenderer.on("reload", function(event, url) {
  window.location.reload();
});

ipcRenderer.on("hard-reload", function(event, url) {
  ipcRenderer.send("hard-reload");
});

// -------------- Features -----------------

ipcRenderer.on('redirect-url', function(event, url) {
  window.location.assign(url);
});

ipcRenderer.on("reload-current-viewer", function(event, url) {
  window.location.href = window.location.href;
});