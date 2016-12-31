const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  name: {type: String, required: true},
  dateOfBirth: {type: Date},
  dateOfDeath: {type: Date},
  bio: String,
  country: String,
  wiki: String,
  website: String,
});
