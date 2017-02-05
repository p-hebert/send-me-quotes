"use strict";

const xss = require('../services/secure/xss');
const ResponseError = require('./errors/ResponseError');
const ValidationError = require('./errors/ValidationError');

module.exports = {
  response: response,
  barebone: barebone
};

function response(res){
  return function(err){
    var body;
    logger.error(err);
    if(err instanceof ResponseError){
      if(err instanceof ValidationError){
        logger.error({metadata: err.metadata});
      }
      body = {
        status: err.status,
        type: err.type,
        message: err.message,
        metadata: err.metadata,
      };
      res.status(err.status).json(xss(body));
    }else if(err.status){
      body = {message: err.message, errors: err.errors};
      res.status(err.status).json(xss(body));
    }else{
      res.status(500).json(xss({
        status: 500,
        type: "SERVER:UNKNOWN:ERROR",
        metadata: err
      }));
    }
  };
}

function barebone(err){
  logger.error(err);
}
