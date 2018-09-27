"use strict";
const path = require("path");

const { app, shell, BrowserWindow, Menu, dialog, ipcRenderer } = require('electron');
const fs = require("fs-extra");

const appName = app.getName();

// TODO: - Logger

class AppMenu {
  getHistorySubmenu() {
		return [{
			label: 'Back',
			accelerator: process.platform === 'darwin' ? 'Command+Left' : 'Alt+Left',
			click(item, focusedWindow) {
				if (focusedWindow) {
          AppMenu.sendAction('back');
          
				}
			}
		}, {
			label: 'Forward',
			accelerator: process.platform === 'darwin' ? 'Command+Right' : 'Alt+Right',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('forward');
				}
			}
		}];
  }
  
  getViewSubmenu() {
		return [{
			label: 'Reload',
			accelerator: 'CommandOrControl+R',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('reload');
				}
			}
		}, {
			label: 'Hard Reload',
			accelerator: 'CommandOrControl+Shift+R',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('hard-reload');
				}
			}
		}, {
			type: 'separator'
		}, {
			role: 'togglefullscreen'
		}, {
			label: 'Zoom In',
			accelerator: process.platform === 'darwin' ? 'Command+Plus' : 'Control+=',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('zoomIn');
				}
			}
		}, {
			label: 'Zoom Out',
			accelerator: 'CommandOrControl+-',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('zoomOut');
				}
			}
		}, {
			label: 'Actual Size',
			accelerator: 'CommandOrControl+0',
			click(item, focusedWindow) {
				if (focusedWindow) {
					AppMenu.sendAction('zoomActualSize');
				}
			}
		}, {
			type: 'separator'
		}, {
			label: 'Toggle DevTools for Share.EW App',
			accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click(item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.webContents.toggleDevTools();
				}
			}
		}];
  }
  
  getHelpSubmenu() {
		return [
			{
				label: `${appName + ' Desktop-'} v${app.getVersion()}`,
				enabled: false
      },
      {
				label: 'Keyboard Shortcuts',
				accelerator: 'Cmd+Shift+K',
				click(item, focusedWindow) {
					if (focusedWindow) {
						AppMenu.sendAction('shortcut');
					}
				}
			},
			{
				label: `What's New...`,
				click() {
					shell.openExternal(`https://github.com/qin9smile/electron-web/releases/tag/v${app.getVersion()}`);
				}
			}, {
				label: 'Show App Logs',
				click() {
					const zip = new AdmZip();
					let date = new Date();
					date = date.toLocaleDateString().replace(/\//g, '-');

					// Create a zip file of all the logs and config data
					zip.addLocalFolder(`${app.getPath('appData')}/${appName}/Logs`);
					zip.addLocalFolder(`${app.getPath('appData')}/${appName}/config`);

					// Put the log file in downloads folder
					const logFilePath = `${app.getPath('downloads')}/Share-logs-${date}.zip`;
					zip.writeZip(logFilePath);

					// Open and select the log file
					shell.showItemInFolder(logFilePath);
				}
			}, {
				label: 'Report an Issue...',
				click() {
					// the goal is to notify the main.html BrowserWindow
					// which may not be the focused window.
					BrowserWindow.getAllWindows().forEach(window => {
						window.webContents.send('open-feedback-modal');
					});
				}
			}];
  }
  
  getWindowSubmenu(tabs, activeTabIndex) {
		const initialSubmenu = [{
			role: 'minimize'
		}, {
			role: 'close'
		}];

		if (tabs && tabs.length > 0) {
			const ShortcutKey = process.platform === 'darwin' ? 'Cmd' : 'Ctrl';
			initialSubmenu.push({
				type: 'separator'
			});
			for (let i = 0; i < tabs.length; i++) {
				// Do not add functional tab settings to list of windows in menu bar
				if (tabs[i].props.role === 'function' && tabs[i].webview.props.name === 'Settings') {
					continue;
				}

				initialSubmenu.push({
					label: tabs[i].webview.props.name,
					accelerator: tabs[i].props.role === 'function' ? '' : `${ShortcutKey} + ${tabs[i].props.index + 1}`,
					checked: tabs[i].props.index === activeTabIndex,
					click(item, focusedWindow) {
						if (focusedWindow) {
							AppMenu.sendAction('switch-server-tab', tabs[i].props.index);
						}
					},
					type: 'checkbox'
				});
			}
		}

		return initialSubmenu;
  }
  
  getDarwinTpl(props) {
		const { tabs, activeTabIndex } = props;

		return [{
			label: `${app.getName()}`,
			submenu: [{
				label: 'About Share.EW',
				click(item, focusedWindow) {
					if (focusedWindow) {
						AppMenu.sendAction('open-about');
					}
				}
			}, {
				label: `Check for Update`,
				click() {
					AppMenu.checkForUpdate();
				}
			}, {
				type: 'separator'
			}, {
				role: 'services',
				submenu: []
			}, {
				type: 'separator'
			}, {
				role: 'hide'
			}, {
				role: 'hideothers'
			}, {
				role: 'unhide'
			}, {
				type: 'separator'
			}, {
				role: 'quit'
			}]
		}, {
			label: 'Edit',
			submenu: [{
				role: 'undo'
			}, {
				role: 'redo'
			}, {
				type: 'separator'
			}, {
				role: 'cut'
			}, {
				role: 'copy'
			}, {
				role: 'paste'
			}, {
				role: 'pasteandmatchstyle'
			}, {
				role: 'delete'
			}, {
				role: 'selectall'
			}, {
        type: "separator"
      }, {
        label: "find",
        click(item, focusedWindow) {
          if (focusedWindow) {
             console.log("find...");
          }
        }
      }]
		}, {
			label: 'View',
			submenu: this.getViewSubmenu()
		}, {
			label: 'History',
			submenu: this.getHistorySubmenu()
		}, {
			label: 'Window',
			submenu: this.getWindowSubmenu(tabs, activeTabIndex)
		}, {
			role: 'help',
			submenu: this.getHelpSubmenu()
		}];
  }
  
  getOtherTpl(props) {
		const { tabs, activeTabIndex } = props;

		return [{
			label: '&File',
			submenu: [{
				label: 'About Share.EW',
				click(item, focusedWindow) {
					if (focusedWindow) {
						AppMenu.sendAction('open-about');
					}
				}
			}, {
				label: `Check for Update`,
				click() {
					AppMenu.checkForUpdate();
				}
			}, {
				type: 'separator'
			}, {
				role: 'quit',
				accelerator: 'Ctrl+Q'
			}]
		}, {
			label: '&Edit',
			submenu: [{
				role: 'undo'
			}, {
				role: 'redo'
			}, {
				type: 'separator'
			}, {
				role: 'cut'
			}, {
				role: 'copy'
			}, {
				role: 'paste'
			}, {
				role: 'pasteandmatchstyle'
			}, {
				role: 'delete'
			}, {
				type: 'separator'
			}, {
				role: 'selectall'
			}, {
        type: "separator"
      }, {
        label: "find",
        click(item, focusedWindow) {
          if (focusedWindow) {
             console.log("find...");
          }
        }
      }]
		}, {
			label: '&View',
			submenu: this.getViewSubmenu()
		}, {
			label: '&History',
			submenu: this.getHistorySubmenu()
		}, {
			label: '&Window',
			submenu: this.getWindowSubmenu(tabs, activeTabIndex)
		}, {
			label: '&Help',
			role: 'help',
			submenu: this.getHelpSubmenu()
		}];
  }
  
  static sendAction(action, ...params) {
		const win = BrowserWindow.getAllWindows()[0];

		if (process.platform === 'darwin') {
			win.restore();
    }
    
    console.log("action", action, ...params);
    // ipcMain.send(action, ...params);
		win.webContents.send(action, ...params);
	}

	static checkForUpdate() {
		// appUpdater(true);
	}
	
	setMenu(props) {
		const tpl = process.platform === 'darwin' ? this.getDarwinTpl(props) : this.getOtherTpl(props);
		const menu = Menu.buildFromTemplate(tpl);
		Menu.setApplicationMenu(menu);
	}
}

module.exports = new AppMenu();