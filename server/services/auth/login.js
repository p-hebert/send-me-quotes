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
  .then(results => {
    if (!results.length || results.password === null) {
      console.log("HTTP 401: User doesn't exist");
      unauthorized(req, res, next);
    } else if (results.length === 1 && !secure.match(password, results[0].salt, results[0].password)) {
      console.log(`HTTP 401: Credentials didn't match`);
      unauthorized(req, res, next);
    } else if (results.length > 1) {
      server_error(req, res, "Inconsistent Database: More than one user matched the username / email");
    } else {
      console.log("HTTP 200: Successful Login");
      User.update({lastLogin: new Date(Date.now())}, {where : {id : results[0].id}});
      store_user(req, results[0]);
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
  console.log("HTTP 401: Unauthorized");
  if (req.session && req.session.destroy) {
    req.session.destroy(function(err) {
      if (err) {
        console.error(err);
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
