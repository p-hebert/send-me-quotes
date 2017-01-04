"use strict";

const xss = require('../services/secure/xss');

module.exports = function(res){
  return function(err){
    if(err.status){
      var body = {message: err.message, errors: err.errors};
      console.log(`HTTP ${err.status}: ${err.message}`);
      res.status(err.status).json(xss(body));
    }else{
      console.log(`HTTP 500: ${err}`);
      res.status(500).json({message: 'Could not reach the database'});
    }
  };
};
