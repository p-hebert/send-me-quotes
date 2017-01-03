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

var UserSchema = new Schema({
  username: String,
  email: String,
  emailVerified: Boolean,
  emailToken: String,
  emailTokenValidUntil: Date,
  password: String,
  salt: String,
  phone: String,
  newPhone: String,
  phoneVerified: Boolean,
  phoneCode: String,
  phoneCodeValidUntil: String,
  country: String,
  lastLogin: Date,
  sets: [QuoteSetSchema],
  notes: [QuoteModSchema]
});

module.exports = UserSchema;
