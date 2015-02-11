#!/usr/bin/env node
;(function(config) {

  var argv = require('yargs').argv;  
  var Handlebars = require('handlebars');
  var log = require("../utils/logger");
  var io = require("../utils/io");
  var path = require("path");

  if(Object.keys(argv).length < 4){
    log.error('Check arguments passed (Usage: $ node index.js --t function --f NAME --r RETURN_TYPE(Varchar, int, bit etc...) [--d "DESCRIPTION"] [--o /path/to/output/] [--p [Ex.: --p "@Name nvarchar(200), @Date datetime"]])');
    return;
  }
  
  var source = io.readFile(path.join(process.cwd(), 'templates/function.template'));
  var params = [];
  if(argv.p){
    params = argv.p.split(",");
  }

  var context = {
      func: argv.f
    , output: argv.r
    , description: argv.d || 'Nao informado'
    , now: new Date().toISOString()
    , params: params.join(",\n")
  };

  var template = Handlebars.compile(source);
  var func = template(context);
  var path = fix(argv.o);

  io.write(path + context.func + '.sql', func);

  log.success('Script for function ' + context.func + ' was created!');
  
  function fix(arg){
    return io.fixDirPath(arg, path.join(process.cwd(), "out/"));
  }

})(process.argv.slice(2));