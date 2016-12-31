"use strict";

const models = require('../../models/index');
const secure = require('../secure/hash');
const mongo_sanitize = require('mongo-sanitize');
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
  var body = mongo_sanitize(req.body);
  return User.findOne({ $or: [{email: body.email}, {username: body.username}]})
  .then(user => {
    if (user === null) {
      if (typeof body.password === "string") {
        let pwd = secure.hash(body.password);
        user = new User({
          username: body.username,
          email: body.email,
          password: pwd.hash,
          salt: pwd.salt,
          phone: body.phone,
          country: body.country,
        });
        return user.save();
      } else {
        return Promise.reject({
          status: 400,
          message: 'Validation Error(s)',
          errors: { password: 'Improper password type' }
        });
      }
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
  }).catch(catcher(res));
}
