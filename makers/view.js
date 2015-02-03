#!/usr/bin/env node
;(function(config) {

  var argv = require('yargs').argv;  
  var Handlebars = require('handlebars');
  var log = require("../utils/logger");
  var io = require("../utils/io");
  var path = require("path");

  if(Object.keys(argv).length < 4){
    log.error('Check arguments passed (Usage: $ node index.js --t view --v NAME [--d "DESCRIPTION"] [--o /path/to/output/])');
    return;
  }
  
  var source = io.readFile(path.join(process.cwd(), "templates/view.template"));

  var context = {
      view: argv.v
    , description: argv.d || 'Nao informado'
    , now: new Date().toISOString()
  };

  var template = Handlebars.compile(source);
  var view = template(context);
  var path = fix(argv.o);

  io.write(path + context.view + '.sql', view);

  log.success('Script for view ' + context.view + ' was created !');

  function fix(arg){
    return io.fixDirPath(arg, path.join(process.cwd(), "out/"));
  }
  
})(process.argv.slice(2));