#!/usr/bin/env node
;(function(config) {

  var argv = require('yargs').argv;  
  var Handlebars = require('handlebars');
  var log = require("../utils/logger");
  var io = require("../utils/io");
  var path = require("path");

  if(Object.keys(argv).length < 4){
    log.error('Check arguments passed (Usage: $ node index.js --t procedure --p NAME --e CUSTOMER [--d "DESCRIPTION"] [--o /path/to/output/])');
    return;
  }
  
  var source = io.readFile(path.join(process.cwd(), 'templates/procedure.template'));
  var context = {
      storedProcedure: argv.p
    , entityId: (typeof argv.e !== 'undefined') ? argv.e.toLowerCase() : ''
    , description: argv.d || 'Nao informado'
    , now: new Date().toISOString()
  };

  var template = Handlebars.compile(source);
  var procedure = template(context);
  var path = fix(argv.o);

  io.write(path + context.storedProcedure + '.sql', procedure);

  log.success('Script for procedure ' + context.storedProcedure + ' was created!');

  function fix(arg){
    return io.fixDirPath(arg, path.join(process.cwd(), "out/"));
  }
  
})(process.argv.slice(2));