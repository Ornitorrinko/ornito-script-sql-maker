;(function(){

    var fs = require('fs');
    var p = require('path');

    var IO = {};

    IO.exists = function(path, cb){
        if(cb){
            fs.exists(path, function (exists) {
                cb(exists);
            });
        }else{
            return fs.existsSync(path);
        }
    };

    IO.write = function (path, data, options, cb){
        if(typeof(options) == 'function'){
            cb = options;
            options = undefined;
        }

        options = options || {encoding :'utf8'};

        if(cb){
            fs.writeFile(path, data, options, function (err) {
                if(err){
                    cb(err);
                }else {
                    cb(null);
                }
            });
        }else{
            fs.writeFileSync(path, data, options);
            return true;
        }
    };

    IO.readFile = function(path, cb){
        if(cb){
            fs.readFile(path, "utf-8", function(err, data){
                if(err){
                    cb(err);
                }else{
                    cb(null, data);
                }
            })
        }else{
            return fs.readFileSync(path, "utf-8");
        }
    };

    IO.remove = function(path, cb) {
        if(cb){
            fs.unlink(path, function(err) {
                if(err){
                    cb(err);  
                }else{
                    cb(null, true);  
                } 
            });
        }else{
            fs.unlinkSync(path);
            return true;
        }
    };

    IO.readDir = function(path, cb){
        if(cb){
            fs.readdir(path, function(err, files){
                if(err){
                    cb(err);
                }else{
                    cb(null, files);
                }
            });
        }else{
            return fs.readdirSync(path);
        }
    };

    IO.makeDir = function(path, mode, cb) {
        if(typeof(mode) == 'function'){
            cb = mode;
            mode = undefined;
        }

        mode = mode || '0777';
        if(cb) {
            fs.mkdir(path, mode, function (err) {
                if(err) cb(err);
                else cb(null, true);
            });
        }else{
            fs.mkdirSync(path, mode);
            return true;
        }
    };

    IO.listAllFiles = function(dir, filelist){
      if(dir[dir.length-1] != '/'){
        dir = dir.concat('/');
      } 

      var files = IO.readDir(dir);
      filelist = filelist || [];

      files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
          filelist = IO.listAllFiles(dir + file + '/', filelist);
        }else {
          filelist.push(dir+file);
        }
      });
      return filelist;
    };

    IO.fileName = function(path, ext){
        return p.basename(path, ext);
    };

    IO.fixDirPath = function(path, except){
        if(path){
          if(path[path.length-1] != '/'){
            return path.concat('/');
          }
          return path;
        }else{
            return except;
        }
    };

    module.exports = IO;

})();