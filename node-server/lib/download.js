let request = require('request');
let fs = require('fs'); // fs para escrever diretamente para o disco, much win
let Puid = require('puid');
let puid = new Puid(true); // Short 12-digit ID
let path = require('path');
let Promise = require('bluebird');

let download = function(fileUri, filename, callback){
    let downloadPromise = new Promise(function(resolve, reject){
        let id = puid.generate();
        let dest = path.join(__dirname,id.concat(filename));
        let writeStream = fs.createWriteStream(dest);

        writeStream.on('finish', function(){
            // Return the full path of the newly downloaded file
            resolve(dest);
        });

        writeStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        let readStream = request.get(fileUri);

        readStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        readStream.pipe(writeStream);
    });


    downloadPromise.then(function(dest){
        callback(null, dest);
    }).catch(function(err){
        callback(err);
    });
};

module.exports = download;
