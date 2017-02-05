"use strict";

const ResponseError = require("./ResponseError");

class PersistenceError extends ResponseError {
  constructor(error){
    error.message = error.message || "Persistence Error";
    super(error);
  }
}

module.exports = PersistenceError;
