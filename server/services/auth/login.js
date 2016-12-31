const chalk = require('chalk');
const models = require('../../models/index');
const secure = require('../secure/hash');
const mongo_sanitize = require('mongo-sanitize');

const User = models.User;

module.exports = login;

function login(req, res, next) {
  if (req.body.username || req.body.email) {
    local_login(req, res, next);
  } else {
    res.sendStatus(400);
  }
}

function local_login(req, res, next) {
  var payload = {}
  var password = req.body.password;

  if(req.body.username){
    payload.username = mongo_sanitize(req.body.username);
  }else{
    payload.email = mongo_sanitize(req.body.email);
  }
  return User.find(payload)
  .then(user => {
    if (!user || user.password === null) {
      unauthorized(req, res, next);
    } else if (!secure.validate_pwd_hash(password, user.salt, user.password)) {
      unauthorized(req, res, next);
    } else {
      User.update({lastLogin: new Date(Date.now())}, {where : {id : user.id}});
      store_user(req, user);
      next();
    }
  }).catch(err => {
    server_error(req, res, err);
  });
}

function store_user(req, user){
  req.user = user;
  req.session.user = req.user.id;
}

function server_error(req, res, err){
  console.error(err);
  if(req.session && req.session.destroy){
    req.session.destroy(function(err) {
      res.status(500).json({
        message: 'Server error'
      });
    });
  }else{
    res.status(500).json({
      message: 'Server error'
    });
  }
}

function unauthorized(req, res, next) {
  console.log("Unauthorized");
  if (req.session && req.session.destroy) {
    req.session.destroy(function(err) {
      if (err) {
        console.error(chalk.red(err));
      }
      res.status(401).json({
        message: 'Incorrect email or password.'
      });
    });
  } else {
    res.status(401).json({
      message: 'Incorrect email or password.'
    });
  }
}
