"use strict";

const models = require('../../models/index');
const secure = require('../secure/hash');
const mongo_sanitize = require('mongo-sanitize');
const validate = require('../secure/validate');
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
  var catcher = catcher(res);
  if(!vuser.refused && has_mandatory_fields(vuser.validated)){
    let vuser = vuser.validated;
    return User.findOne({ $or: [{email: vuser.email}, {username: vuser.username}]})
    .then(user => {
      if (user === null) {
        let pwd = secure.hash(vuser.password);
        user = new User({
          username: vuser.username,
          email: vuser.email,
          password: pwd.hash,
          salt: pwd.salt,
          phone: vuser.phone,
          country: vuser.country || null,
        });
        return user.save();
      }else{
        let errors = {};
        errors.email = user.email === vuser.email ? true : undefined;
        errors.username = user.username === vuser.username ? true : undefined;
        return Promise.reject({
          status: 400,
          message: 'User already exists',
          errors: errors
        });
      }
    }).then(() => {
      next();
    }).catch(catcher);
  }else{
    return Promise.reject({status: 400, message: "Validation error(s)", errors: vuser.errors})
    .catch(catcher);
  }
}

function has_mandatory_fields(user){
  const fields = ["username", "email", "password", "phone", "country"];
  for(let i = 0 ; i < fields.length; i++){
    if(user[fields[i]] === undefined){
      return false;
    }
  }
  return true;
}
