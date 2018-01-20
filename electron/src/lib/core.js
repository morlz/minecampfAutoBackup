const { ipcMain } = require('electron')
const settings = require('./settings')


class Core {
	constructor () {
		//events

		ipcMain.on('wannaSettings', (e, data) => {
			settings
				.get(data)
				.then(settings => e.sender.send('settings', settings))
		})


	}
}


module.exports = new Core()
