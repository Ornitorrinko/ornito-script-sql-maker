#!/usr/bin/env node
;(function(config) {

  var argv = require("yargs").argv;  
  var Handlebars = require('handlebars');
  var log = require("../utils/logger");
  var io = require("../utils/io");
  var path = require("path");

  if(Object.keys(argv).length < 4){
    log.error('Check arguments passed (Usage: $ node index.js --t procedure --p NAME --k TEMPLATE_NAME [--e ENTITYNAME] [--d "DESCRIPTION"] [--o /path/to/output/] [--p If present, will ignore the "k" param] [Ex.: --params "@Name nvarchar(200), @Date datetime"]])');
    return;
  }
  
  var DEFAULT = "DEFAULT"
  var kind = argv.k;
  var params = [];
  if(argv.params){
    params = argv.params.split(",");
    kind = DEFAULT;
  }

  var source = io.readFile(path.join(process.cwd(), "templates", "procedure_" + kind + ".template"));
  var context = {
      storedProcedure: proc(kind, argv.p)
    , entityId: (typeof argv.e !== "undefined") ? argv.e.toLowerCase() : ""
    , description: argv.d || "Nao informado"
    , now: new Date().toISOString()
    , params: params
    , author: AUTHOR
  };

  var template = Handlebars.compile(source);
  var procedure = template(context);
  var path = fix(argv.o);

  io.write(path + context.storedProcedure + ".sql", procedure);

  log.success("Script for procedure " + context.storedProcedure + " was created!");

  function proc(kind, name){
    if(kind === DEFAULT){
      return name;
    }

    return kind.toUpperCase() + "_" + name;
  }

  function fix(arg){
    return io.fixDirPath(arg, path.join(process.cwd(), "out/"));
  }
  
})(process.argv.slice(2));