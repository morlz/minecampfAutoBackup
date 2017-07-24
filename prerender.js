const Vue = require("vue");

var app = (function(){

	var main = new Vue({
		el: ".main",
		data: {
			interval: "3600",
			index: "0",
			backupFolder: "",
			worldFolder: "",
			start: false
		}
	});

})();
