;(function(){

	var colors = require('colors');
	
	var Logger = {};

	Logger.error = function(error){
		console.log("Ornito error :( => ".bgRed, error.red);
	}

	Logger.help = function(help){
		console.log("Ornito helper => ".bgCyan, help.cyan);
	}

	Logger.success = function(output){
		console.log("Successfull :) ".bgGreen, output.green);
	}

	module.exports = Logger;

})();