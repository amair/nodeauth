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

const parse = csv.parse({columns: true});
let output = [];
let record=[];
const input = fs.createReadStream('ClubListing.csv');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const serverConfig = require('./server_config.json');

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
    id: 1112,
    name: 'Startup Ontario',
    sponsor: 'Ryan Chenkie',
    seedFund: '750k'
  },
  {
    id: 1113,
    name: 'Startup Uttah',
    sponsor: 'Diego Poza',
    seedFund: '550k'
  },
  {
    id: 1114,
    name: 'Startup Australia',
    sponsor: 'Eugene Kogan',
    seedFund: '500k'
  },
  {
    id: 1115,
    name: 'Startup Buenos Aires',
    sponsor: 'Sebastian Peyrott',
    seedFund: '600k'
  },
  {
    id: 1116,
    name: 'Startup Lagos',
    sponsor: 'Prosper Otemuyiwa',
    seedFund: '650k'
  },
  {
    id: 1117,
    name: 'Startup Oslo',
    sponsor: 'Mark Fish',
    seedFund: '600k'
  },
  {
    id: 1118,
    name: 'Startup Calabar',
    sponsor: 'Christian Nwamba',
    seedFund: '800k'
  },
  {
    id: 1119,
    name: 'Startup Nairobi',
    sponsor: 'Aniedi Ubong',
    seedFund: '700k'
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
  },
  {
    id: 2113,
    name: 'Startup Addis-Ababa',
    sponsor: 'Aliko Dangote',
    seedFund: '8M'
  },
  {
    id: 2114,
    name: 'Startup Abuja',
    sponsor: 'Femi Otedola',
    seedFund: '5M'
  },
  {
    id: 2115,
    name: 'Startup Paris',
    sponsor: 'Jeff Bezos',
    seedFund: '1.6M'
  },
  {
    id: 2116,
    name: 'Startup London',
    sponsor: 'Dave McClure',
    seedFund: '1M'
  },
  {
    id: 2117,
    name: 'Startup Oslo',
    sponsor: 'Paul Graham',
    seedFund: '2M'
  },
  {
    id: 2118,
    name: 'Startup Bangkok',
    sponsor: 'Jeff Clavier',
    seedFund: '5M'
  },
  {
    id: 2119,
    name: 'Startup Seoul',
    sponsor: 'Paul Buchheit',
    seedFund: '4M'
  }];

  res.json(privateBattles);
});

// app.get('/api/private/v1/boats', authCheck, (req,res) => {
  app.get('/api/public/v1/boats', (req,res) => {
  // TODO: Confirm that loading is complete
  res.json(output);
});

app.get('/api/public/v1/boat/:boat_id', (req,res) => { //(/d+) limit to digits
  // TODO: Confirm that loading is complete
  console.log(output[req.params['boat_id']]);
  res.json(output[req.params['boat_id']]);
});

parse.on('readable', function(){
  while(record = parse.read()){
    // After Node v7 will be able to replace with object.values
    // Array.prototype.push.apply(output, Object.keys(record).map((k) => record[k]));
    //Array.prototype.push.apply(output, record);
    output.push(record);
    // db.collection('boats').save(record, (err, result) => {
    //   if (err) return console.log(err)

    //   console.log('saved to database')
    // }
  }
});

parse.on('error', function(err){
  console.log(err.message);
});

parse.on('finish', function(){
//  console.log(JSON.stringify(output));
console.log('Loaded ' + output.length + ' records');
parse.end();
});


if ((serverConfig.mongo_server_address === undefined) || (serverConfig.mongo_password === undefined) ) {
  console.log('No mongo connection details');
} else {
  const uri = "mongodb+srv://app:".concat(serverConfig.mongo_password).concat("@").concat(serverConfig.mongo_server_address).concat("/test?retryWrites=true");
  MongoClient.connect(uri, function(err, client) {
    if (err) return console.log(err);
    app.listen(3333, () => {
      input.pipe(parse);
      console.log('Listening on localhost:3333');
    })
  });
}








