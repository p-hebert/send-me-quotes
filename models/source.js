const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mediums = [
  'book', 'ebook', 'online', 'twitter', 'facebook', 'blog', 'periodical',
  'newspaper', 'interview', 'conference', 'album', 'movie', 'television',
  'podcast'];

module.exports = new Schema({
  medium: {type:String, enum: mediums},
  title: {type:String, required: true},
  url: String,
  author: Schema.Types.ObjectId,
  publisher: String,
  doi: String,
  date_published: Date,
  date_accessed: Date,
  country: String,
  city: String
});
