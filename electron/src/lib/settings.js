const fs = require('fs')
const path = require('path')

class Settings {
	constructor() {
		this.filename = 'setings.json'
		this.path = '/'
	}

	get (defaultSettings) {
		return new Promise ((resolve, reject) => {

			if (!fs.existsSync(this._filePath))
				fs.writeFileSync(this._filePath, JSON.stringify(defaultSettings), 'utf8')

			fs.readFile(this._filePath)
				.then(settings => console.log(settings))
			resolve(defaultSettings)
		})
	}

	get _filePath () {
		console.log(dirname);
		return path.resolve(dirname, this.path, this.filename)
	}
}

module.exports = new Settings()
