"use strict";

const ResponseError = require("./ResponseError");

class ValidationError extends ResponseError {
  constructor(message, status, errors){
    super(message || "Validation Error(s)");
    this.status = status || 400;
    this.errors = errors;
  }
}

module.exports = ValidationError;
