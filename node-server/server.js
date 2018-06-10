'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv');
const MongoClient = require('mongodb').MongoClient;
const download = require('./lib/download');

const parse = csv.parse({columns: true});
const serverConfig = require('./server_config.json');
const csv_download_loc = "https://www.topyacht.com.au/rorc/data/ClubListing.csv"
const csv_filename = 'ClubListing.csv';
let output = [];
let record=[];
let boats_initialized = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://catslippers.eu.auth0.com/.well-known/jwks.json"
  }),
    // This is the identifier we set when we created the API
    audience: 'https://www.yachthandicap.org',
    issuer: "https://catslippers.eu.auth0.com/",
    algorithms: ['RS256']
  });


app.get('/api/battles/public', (req, res) => {
  const publicBattles = [
  {
    id: 1111,
    name: 'Startup NYC',
    sponsor: 'Alec Pesola',
    seedFund: '500k'
  },
  {
    id: 1113,
    name: 'Startup Uttah',
    sponsor: 'Diego Poza',
    seedFund: '550k'
  }];

  res.json(publicBattles);
});


app.get('/api/battles/private', authCheck, (req,res) => {
  const privateBattles = [
  {
    id: 2111,
    name: 'Startup Seattle',
    sponsor: 'Mark Zuckerberg',
    seedFund: '10M'
  },
  {
    id: 2112,
    name: 'Startup Vegas',
    sponsor: 'Bill Gates',
    seedFund: '20M'
  }];

  res.json(privateBattles);
});

// app.get('/api/private/v1/boats', authCheck, (req,res) => {
  app.get('/api/public/v1/boats', (req,res) => {
    if (boats_initialized) {
      res.json(output);
    } else {
      res.status(449).send("Server still initializing");
    }
});

app.get('/api/public/v1/boat/:boat_id', (req,res) => { //(/d+) limit to digits
    if (boats_initialized) {
      console.log(output[req.params['boat_id']]);
      res.json(output[req.params['boat_id']]);
    } else {
      res.status(449).send("Server still initializing");
    }
});

parse.on('readable', function(){
  while(record = parse.read()){
    output.push(record);
    // db.collection('boats').save(record, (err, result) => {
    //   if (err) return console.log(err)

    //   console.log('saved to database')
    // })
  }
});

parse.on('error', function(err){
  console.log(err.message);
});

parse.on('finish', function(){
  //  console.log(JSON.stringify(output));
  console.log('Loaded ' + output.length + ' records');
  parse.end();
  boats_initialized = true;
});


if ((serverConfig.mongo_server_address === undefined) || (serverConfig.mongo_password === undefined) ) {
  console.log('No mongo connection details');
} else {
  const uri = "mongodb+srv://app:".concat(serverConfig.mongo_password).concat("@").concat(serverConfig.mongo_server_address).concat("/test?retryWrites=true");
  MongoClient.connect(uri, function(err, client) {
    if (err) return console.log(err);
    app.listen(3333, () => {
      download(csv_download_loc, csv_filename, function(err, csv_filepath){
      if(err) return console.log (err);
      console.log('Downloaded %s', csv_filepath);

      const input = fs.createReadStream(csv_filepath);
      input.pipe(parse);
    });

    console.log('Listening on localhost:3333');
    })
  });
}









