const MongoClient = require('mongodb').MongoClient;
const serverConfig = require('./server_config.json');

const databaseName="yachthandicap";
const boatsCollection="boats"

let db ='';

let connect = function(){
    if ((serverConfig.mongo_server_address === undefined) || (serverConfig.mongo_password === undefined) ) {
      console.log('No mongo connection details');
    } else {
      const uri = "mongodb+srv://app:".concat(serverConfig.mongo_password).concat("@").concat(serverConfig.mongo_server_address).concat("/test?retryWrites=true");
      MongoClient.connect(uri, function(err, client) {
        if (err) return console.log(err);
        db = client.db(databaseName);
      });
    }
};

let close = function() {
    db.close();
}

let initializeBoats = function () {
    db.collection(boatsCollection).drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
    });
};



let storeBoat = function(boat) {
    db.collection(boatsCollection).save(boat, (err, result) => {
        if (err) return console.log(err)
    });
};

let getBoats = function(callback) {
   db.collection(boatsCollection).find({}).toArray(function(err, docs) {
      if (err) return console.log(err);
      callback(null, docs);
    });

};

let getBoatNamesAndSailNumbers = function(callback) {
    db.collection(boatsCollection).find(
      {},
      {
        'Boat Name': 1,
        'Sail No': 1
      }
    ).toArray(function(err, docs) {
      if (err) return console.log(err);
      callback(null, docs);
    });

};


module.exports = {
   connect,
   initializeBoats,
   storeBoat,
   getBoats,
   getBoatNamesAndSailNumbers,
   close
}
