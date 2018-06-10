const MongoClient = require('mongodb').MongoClient;
const serverConfig = require('./server_config.json');

const database_name="yachthandicap";
const boats_collection="boats"

let db ='';

let connect = function(){
    if ((serverConfig.mongo_server_address === undefined) || (serverConfig.mongo_password === undefined) ) {
      console.log('No mongo connection details');
    } else {
      const uri = "mongodb+srv://app:".concat(serverConfig.mongo_password).concat("@").concat(serverConfig.mongo_server_address).concat("/test?retryWrites=true");
      MongoClient.connect(uri, function(err, client) {
        if (err) return console.log(err);
        db = client.db(database_name);
      });
    }
};

let close = function() {
    db.close();
}

let initialize_boats = function () {
    db.collection(boats_collection).drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
    });
};



let store_boat = function(boat) {
    db.collection(boats_collection).save(boat, (err, result) => {
        if (err) return console.log(err)

      // console.log('%s saved to database', result)
    });
};

let get_boats = function(callback) {
   db.collection(boats_collection).find({}).toArray(function(err, docs) {
      callback (null, docs);
    });

};

let get_boat_names_and_sail_numbers = function(callback) {
    db.collection(boats_collection).find({}, { "Boat Name": 1, "Sail No": 1 }).toArray(function(err, docs) {
        callback (null, docs);
    });

};


module.exports = {
   connect,
   initialize_boats,
   store_boat,
   get_boats,
   get_boat_names_and_sail_numbers,
   close
}