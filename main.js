const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs")
const ncp = require("ncp").ncp;

const Config = require('./js/config.js');

var config = new Config("config.json", fs);

// No limit, because why not?
ncp.limit = 0;

let win

function createWindow () {
	win = new BrowserWindow({
		width: 725,
		height: 445,
		resizable: false,
		autoHideMenuBar: true
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	//win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})

ipcMain.on('config-get', (e) => {
	config.load().then((data) => {
		e.sender.send('config', data)
	}).catch(console.log);
})


ipcMain.on('config-set', (e, data) => {
	config.update(data)
})

ipcMain.on('check-folder', (e, data) => {
	console.log("check-folder", data);
	fs.exists(data, (exists) => {
		console.log(exists);
		e.sender.send("folder-checked", exists);
	})
})

//ooooooh YEEEEEESSS
ipcMain.on('backup', (e, data) => {
	fs.exists(data.worldFolder, (exists1) => {
		fs.exists(data.worldFolder, (exists2) => {
			if(exists1 && exists2){
				ncp(data.worldFolder, path.join(data.backupFolder, "backup_" + data.index), function (err) {
					if (err) {
						return console.error(err)
					}
					console.log("backup_" + data.index, "created in ", data.backupFolder, "from", data.worldFolder)
				})
			}
		})
	})
})
