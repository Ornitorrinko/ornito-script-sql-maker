#!/usr/bin/env node
;(function(config) {
	var argv = require("yargs").argv;
	var log = require("../utils/logger");
	var io = require("../utils/io");
	var path = require("path");
	var type = argv.t;
	var help = argv.h;

	if(help){
		log.help("Usage: node index.js --t 'procedure' or 'function' or 'view'");
		return;
	}

	if(!type){
		log.error("Expected --t (TYPEOF) argument but received: " + type);
		return;
	}

	var basePath = path.join(process.cwd(), "makers/");
	var makers = [];
	var maker = io
		.readDir(basePath)
		.filter(function(file){
			var name = io.fileName(file, ".js");
			makers.push(name);
			return  name === type;
		});

	if(maker.length > 0){
		require(basePath + maker[0]);
	}else{
		log.error("Maker: " + type + " not found! Makers available: " + makers);
		return;
	}

})(process.argv.slice(2));