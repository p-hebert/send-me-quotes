'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const env = process.env.NODE_ENV || 'development';
const config = require('../.config/server/index')[env];

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.set('port', config.global.port);

app.listen(config.global.port, function() {
  console.log(`Listening to port ${config.global.port}`);
});
