const models = require('../../models/index');
const mongo_sanitize = require('mongo-sanitize');
const validate = require('../secure/validation/index');
const catcher = require('../../utilities/catcher');
const User = models.User;

module.exports = {
  request: request,
  callback: callback
};

function request(req, res) {
  var vuser = validate.user(mongo_sanitize(req.body));
  if(!vuser.refused){
    vuser = vuser.validated;
    return User.findOne({ $or: [{email: vuser.email}, {username: vuser.username}]})
    .then(user => {
      if (user === null) {
        res.sendStatus(200);
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
    }).catch(catcher(res));
  }else{
    return Promise.reject({status: 400, message: "Validation error(s)", errors: vuser.errors})
    .catch(catcher(res));
  }
}

function callback(user) {
  let uexist = {
    email: false,
    username: false
  };
  return User.findOne({ $or: [{email: user.email}, {username: user.username}]})
  .then(user => {
    if (user === null) {
      return Promise.resolve(uexist);
    }else{
      uexist.email = user.email === vuser.email ? true : false;
      uexist.username = user.username === vuser.username ? true : false;
      return Promise.resolve(uexist);
    }
  });
}
