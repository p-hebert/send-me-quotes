'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('.config/index')[env];

//Setting up Mongoose ES6 Promises
mongoose.Promise = global.Promise;
// Database Connection
mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.dbname}`);

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.set('port', config.global.port);

app.listen(config.global.port, function() {
  console.log(`Listening to port ${config.global.port}`);
});
