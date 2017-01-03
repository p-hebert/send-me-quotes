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
  if(!vuser.refused){
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
          country: vuser.country,
        });
        return user.save();
      }else{
        let errors = {};
        errors.email = user.email === body.email ? true : undefined;
        errors.username = user.username === body.username ? true : undefined;
        return Promise.reject({
          status: 400,
          message: 'User already exists',
          errors: errors
        });
      }
    }).then((user) => {
      req.sendStatus(200);
      next();
    }).catch(catcher);
  }else{
    return Promise.reject({status: 400, message: "Validation error(s)", errors: vuser.errors})
    .catch(catcher);
  }
}
