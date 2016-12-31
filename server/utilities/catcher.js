"use strict";

const xss = require('../secure/xss');

module.exports = function(res){
  return function(err){
    console.log(err);
    if(err.status){
      var body = {message: err.message, errors: err.errors};
      res.status(err.status).json(xss(body));
    }else{
      res.status(500).json({message: 'Could not reach the database'});
    }
  };
};
