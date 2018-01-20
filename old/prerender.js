const {ipcRenderer} = eval('require')('electron') // just skip webpack
const Vue = require("vue")

function setProps (fromObj, toObj) {
	var _self = this;
	for (var prop in fromObj) {
		if (fromObj.hasOwnProperty(prop)) {
			if (typeof fromObj[prop] === 'object') {
				setProps(fromObj[prop], toObj[prop]);
			} else {
				//console.log("set prop", prop, "from", toObj[prop], "to", fromObj[prop])
				toObj[prop] = fromObj[prop]
			}
		}
	}
}

var app = (function(){

	function debounce(func, ms) {
		var isThrottled = false,
			savedArgs,
			savedThis;

		function wrapper() {
			if (isThrottled) { // (2)
				savedArgs = arguments;
				savedThis = this;
				return;
			}

			func.apply(this, arguments); // (1)
			isThrottled = true;
			setTimeout(function() {
				isThrottled = false; // (3)
				if (savedArgs) {
					wrapper.apply(savedThis, savedArgs);
					savedArgs = savedThis = null;
				}
			}, ms);
		}

		return wrapper;
	}

	function backup(description) {
		ipcRenderer.send('backup', {
			index: main.index,
			backupFolder: main.backupFolder.path,
			worldFolder: main.worldFolder.path
		});

		main.lastBackup = Math.round(Date.now() / 1000)
		main.index++

		sendConfig({
			lastBackup: main.lastBackup,
			index: main.index
		})

		console.log( description )
	}

	function sendConfig (data) {
		ipcRenderer.send('config-set', data)
	}
	sendConfig = debounce(sendConfig, 500)

	var data = {
		interval: "3600",
		index: "0",
		backupFolder: {
			path: "",
			status: "Not set"
		},
		worldFolder: {
			path: "",
			status: "Not set"
		},
		serverExec: {
			path: "",
			status: "Not set"
		},
		nextBackup: "0",
		lastBackup: "0",
		enabled: false
	}

	ipcRenderer.on('config', (e, config) => {
		setProps(config, main)
	});

	var main = new Vue({
		el: ".main",
		data: data,
		watch: {
			backupFolder: {
				handler: function (newVal) {
					if (!this.backupFolder.path.length) {
						this.backupFolder.status = "Not set"
					}

					if (this.backupFolder.path.length) {
						this.backupFolder.path = this.backupFolder.path.split("\\").join("/")
						ipcRenderer.once('folder-checked', (e, exist) => {
							if (exist) this.backupFolder.status = "exist"
							if (!exist) this.backupFolder.status = "does no exist"
						});
						ipcRenderer.send('check-folder', this.backupFolder.path);
					}

					sendConfig({
						backupFolder: {
							path: newVal.path
						}
					})
				},
				deep: true
			},
			worldFolder: {
				handler: function (newVal) {
					if (!this.worldFolder.path.length) {
						this.worldFolder.status = "Not set"
					}

					if (this.worldFolder.path.length) {
						this.worldFolder.path = this.worldFolder.path.split("\\").join("/")
						ipcRenderer.once('folder-checked', (e, exist) => {
							if (exist) this.worldFolder.status = "exist"
							if (!exist) this.worldFolder.status = "does no exist"
						});
						ipcRenderer.send('check-folder', this.worldFolder.path);
					}

					sendConfig({
						worldFolder: {
							path: newVal.path
						}
					})
				},
				deep: true
			},
			serverExec: {
				handler: function (newVal) {
					if (!this.serverExec.path.length) {
						this.serverExec.status = "Not work"
					}

					if (this.serverExec.path.length) {
						this.serverExec.path = this.serverExec.path.split("\\").join("/")
						this.serverExec.status = "Not work"
					}

					sendConfig({
						serverExec: {
							path: newVal.path
						}
					})
				},
				deep: true
			},
			enabled: function (enabled) {
				sendConfig({
					enabled: enabled
				})
			},
			interval: function (val, oldVal) {
				if (isNaN(+val)) this.interval = oldVal
				if (this.interval < 1) this.interval = 1
				sendConfig({
					interval: this.interval
				})
			},
			index: function (val, oldVal) {
				if (isNaN(+val)) this.index = oldVal
				if (this.index < 1) this.index = 1
				sendConfig({
					index: this.index
				})
			}
		},
		methods: {
			switchEnabled: function () {
				this.enabled = !this.enabled
			},
			backupNow: function () {
				backup("backup now");
			}
		},
		created: function () {
			ipcRenderer.send('config-get', data)
		}
	})

	setInterval(() => {
		//update counter
		main.nextBackup = +main.interval + (main.lastBackup - Math.round(Date.now() / 1000))

		//do backup
		console.log("interval")
		if (main.nextBackup < 1 && main.enabled) {
			backup("backup")
		}
	}, 1000)
})()
