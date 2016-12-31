const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  text: [{
    value: String,
    lang: {type: String, default: 'en'}
  }],
  lang: {type: String, default: 'en'},
  author: Schema.Types.ObjectId, //The author of the quote
  source: [Schema.Types.ObjectId], //The piece(s) from where the quote is taken
                                   //from, first being the primary source
  tags: [{type: String}], //The associated tags with the quote
  uploadedBy: Schema.Types.ObjectId, //id of user who uploaded
});
