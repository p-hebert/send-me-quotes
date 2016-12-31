const models = require('../../models/index');

const User = models.User;

module.exports = authenticate;

function authenticate(req, res, next){
  console.log("authenticate id: " + req.session.user);
  if(req.session.user){
    User
    .find({id: req.session.user})
    .then(user => {
      if(user){
        req.user = user;
        next();
      }else{
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
}
