'use strict'

const
	electron = require('electron'),
	path = require('path'),
	config = require('../config/electron.js'),
	app = electron.app,
	BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
	if (process.env.NODE_ENV !== 'production')
		require('vue-devtools').install()

	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		title: config.name || "Minecampf Auto Backup v2.0",

		//width: 1600,
		width: 765,
		height: 670,
		show: false,
		center: true,
		resizable: process.env.NODE_ENV === 'development',
		icon: path.join(__dirname, '../icons/icon.png')
	})

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		//mainWindow.webContents.openDevTools()
	})

	mainWindow.loadURL(
		process.env.NODE_ENV === 'production' ?
		`file://${__dirname}/index.html` :
		`http://localhost:${process.env.PORT || require('../../config').dev.port}`
	)

	if (process.env.NODE_ENV === 'development') {
		BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

		let installExtension = require('electron-devtools-installer')

		installExtension.default(installExtension.VUEJS_DEVTOOLS)
			.then(name => mainWindow.webContents.openDevTools())
			.catch(err => console.log('An error occurred: ', err))
	}

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
