"use strict";

const ResponseError = require("./ResponseError");

class AuthorizationError extends ResponseError {
  constructor(error){
    error.message = `Authentication Failure: ${error.message}` || "Authentication Failure";
    super(error);    
  }
}

module.exports = AuthorizationError;
