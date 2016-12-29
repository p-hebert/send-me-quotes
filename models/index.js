'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(module.filename);

var db = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    let schema = require(`./${file}`);
    let name = file.substring(0, file.length-3).capitalize();
    let model = mongoose.model(name, schema);
    db[name] = model;
  });

db.mongoose = mongoose;

module.exports = db;
