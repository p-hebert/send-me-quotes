const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var QuoteSetSchema = new Schema({
  name: {type:String, required:true},
  quotes: [Schema.Types.ObjectId],
  tags: [String],
  authors: [Schema.Types.ObjectId],
  sources: [Schema.Types.ObjectId],
});

var QuoteModSchema = new Schema({
  quote: Schema.Types.ObjectId,
  note: String,
  alteredText: String,
});

module.exports = new Schema({
  username: String,
  email: String,
  password: String,
  salt: String,
  phone: String,
  country: String,
  lastLogin: Date,
  sets: [QuoteSetSchema],
  notes: [QuoteModSchema]
});
