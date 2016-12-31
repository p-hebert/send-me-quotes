'use strict';

const crypto = require('crypto');

module.exports = {
  hash: generate_pwd_hash,
  match: validate_pwd_hash
};

function generate_pwd_hash(password) {
  var salt = genSalt(64);
  return sha256(password, salt);
}

function validate_pwd_hash(password, salt, hash){
  var password = sha256(password, salt);
  return password.hash === hash;
}

// Hashing algorithm sha256
function sha256(password, salt) {
  var hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt: salt,
    hash: value
  };
}

function genSalt(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    // convert to hexadecimal format
    .toString('hex')
    // return required number of characters
    .slice(0, length);
}
