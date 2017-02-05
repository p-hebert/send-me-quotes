'use strict';

const Logger = require('./utilities/logger');
global.logger = new Logger();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const env = process.env.NODE_ENV || 'development';
const config = require('../.config/server/index')[env];
const elasticsearch = require('./services/fuzzy/elasticsearch');


// App
const app = express();
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.set('port', config.global.port);

Promise.all([
  elasticsearch.init()
])
.then(() => {
  app.listen(config.global.port, function() {
    logger.log(`Listening to port ${config.global.port}`);
  });
})
.catch((e) => {
  throw e;
})
