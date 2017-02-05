"use strict";

const ExtendableError = require("./ExtendableError");

class ResponseError extends ExtendableError {
  constructor(error){
    super(error.message || "Response Error");
    this.status = error.status || 400;
    this.type = error.type || "RESPONSE:UNKNOWN:ERROR";
    this.metadata = error.metadata;
  }
}

module.exports = ResponseError;
