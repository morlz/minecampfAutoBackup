'use strict';
function setProps (fromObj, toObj) {
	var _self = this;
	for (var prop in fromObj) {
		if (fromObj.hasOwnProperty(prop)) {
			//console.log( typeof fromObj[prop] , fromObj , prop);
			if (typeof fromObj[prop] === 'object') {
				setProps(fromObj[prop], toObj[prop]);
			} else {
				//console.log("set prop", prop, "from", toObj[prop], "to", fromObj[prop])
				toObj[prop] = fromObj[prop]
			}
		}
	}
}

class Config {
	constructor (filename, fs) {
		this.filename = filename
		this.fs = fs
		console.log('config loaded')
	}

	load () {
		return new Promise((resolve, reject) => {
			this.fs.readFile(__dirname + "/../../../" + this.filename, (err, configData) => {
				if (err) reject(err)
				resolve(JSON.parse(configData.toString()))
			})
		})
	}

	update (newData) {
		return new Promise((resolve, reject) => {
			this.fs.readFile(__dirname + "/../../../" + this.filename, (err, configData) => {
				if (err) reject(err)

				var obj = JSON.parse(configData.toString());

				setProps(newData, obj);

				this.fs.writeFile(__dirname + "/../../../" + this.filename, JSON.stringify(obj), 'utf8', (err) => {
					if (err) reject(err)
					resolve()
				})
			})
		})
	}
}

module.exports = Config;
