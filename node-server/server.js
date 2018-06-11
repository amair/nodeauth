'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv');
const download = require('./lib/download');
const mongodb = require('./lib/mongodb');

const parse = csv.parse({columns: true});
const csvDownloadLoc = "https://www.topyacht.com.au/rorc/data/ClubListing.csv"
const csvFilename = 'ClubListing.csv';
let output = [];
let record=[];
let boatsInitialized = false;

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


// app.get('/api/private/v1/boats', authCheck, (req,res) => {
  app.get('/api/public/v1/boats', (req,res) => {
    if (boatsInitialized === true) {
      mongodb.getBoats(function(err, boatList) {
        console.log("Retreived %s boats", boatList.length);
        res.json(boatList);
      });
    } else {
      res.status(449).send("Server still initializing");
    }
});

app.get('/api/public/v1/boat/:boat_id', (req,res) => { //(/d+) limit to digits
    if (boatsInitialized === true) {
      console.log(output[req.params['boat_id']]);
      res.json(output[req.params['boat_id']]);
    } else {
      res.status(449).send("Server still initializing");
    }
});

parse.on('readable', function(){
  while(record = parse.read()){
    output.push(record);
    mongodb.storeBoat(record);
  }
});

parse.on('error', function(err){
  console.log(err.message);
});

parse.on('finish', function(){
  //  console.log(JSON.stringify(output));
  console.log('Loaded ' + output.length + ' records');
  parse.end();
  boatsInitialized = true;
});

process.on('exit', function() {
  console.log('Server is terminating.');
  mongodb.close();
});

mongodb.connect();

app.listen(3333, () => {
  download(csvDownloadLoc, csvFilename, function(err, csvFilePath){
    if (err) return console.log(err);
    console.log('Downloaded %s', csvFilePath);

    mongodb.initialize_boats();

    const input = fs.createReadStream(csvFilePath);
    input.pipe(parse);
  });

  console.log('Listening on localhost:3333');
});









