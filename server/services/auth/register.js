"use strict";

const models = require('../../models/index');
const secure = require('../secure/hash');
const mongo_sanitize = require('mongo-sanitize');
const validate = require('../secure/validation/index');
const catcher = require('../../utilities/catcher');
const User = models.User;

module.exports = register;

function register(req, res, next) {
  //TODO: Add validation + move sanitization here
  if(req.body.email){
    local_register(req, res, next);
  }else{
    res.sendStatus(400);
  }
}

function local_register(req, res, next){
  var vuser = validate.user(mongo_sanitize(req.body));
  var missing = missing_fields(vuser.validated);
  if(!vuser.refused && !missing.length){
    vuser = vuser.validated;
    return User.findOne({ $or: [{email: vuser.email}, {username: vuser.username}]})
    .then(user => {
      if (user === null) {
        user = new User({
          username: vuser.username,
          email: vuser.email,
          password: vuser.password,
          salt: vuser.salt,
          phone: vuser.phone,
          country: vuser.country || null,
        });
        return user.save();
      }else{
        let errors = {};
        errors.email = user.email === vuser.email ? true : false;
        errors.username = user.username === vuser.username ? true : false;
        return Promise.reject({
          status: 400,
          message: 'User already exists',
          errors: errors
        });
      }
    }).then(() => {
      next();
    }).catch(catcher(res));
  }else if(missing.length){
    return Promise.reject({status: 400, message: `Missing fields: ${missing.join(', ')}`, errors: {fields: missing}})
    .catch(catcher(res));
  }else{
    return Promise.reject({status: 400, message: "Validation error(s)", errors: vuser.errors})
    .catch(catcher(res));
  }
}

function missing_fields(user) {
  const fields = ["username", "email", "password", "phone"];
  const missing = [];
  for(let i = 0 ; i < fields.length; i++){
    if(user[fields[i]] === undefined){
      missing.push(fields[i]);
    }
  }
  return missing;
}
