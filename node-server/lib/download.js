var request = require('request');
var fs = require('fs'); // fs para escrever diretamente para o disco, much win
var Puid = require('puid');
var puid = new Puid(true); // Short 12-digit ID
var path = require('path');
var Promise = require('bluebird');

var download = function(file_uri, filename, callback){
    var p = new Promise(function(resolve, reject){
        var id = puid.generate();
        var dest = path.join(__dirname,id.concat(filename));
        var writeStream = fs.createWriteStream(dest);

        writeStream.on('finish', function(){
            resolve(dest);
        });

        writeStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        var readStream = request.get(file_uri);

        readStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        readStream.pipe(writeStream);
    });


    p.then(function(dest){
        callback(null, dest);
    }).catch(function(err){
        callback(err);
    });
};

module.exports = download;