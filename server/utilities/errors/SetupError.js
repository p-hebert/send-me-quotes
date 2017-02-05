"use strict";

const ResponseError = require("./ResponseError");

class SetupError extends ResponseError {
  constructor(error){
    super(error);
  }
}

module.exports = SetupError;
