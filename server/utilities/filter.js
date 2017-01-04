
const models = require('../models/index');
const User = models.User;

module.exports = {
  user: filter_user
}

function filter_user(user, populate){
  if(populate){
    return User.populate(user, [{path: 'sets'}, {path: 'notes'}])
    .then((user) => {
      return Promise.resolve({
        username: user.username,
        email: user.email,
        country: user.country,
        sets: user.sets,
        notes: user.notes
      });
    });
  }else{
    return Promise.resolve({
      username: user.username,
      email: user.email,
      country: user.country,
      sets: user.sets,
      notes: user.notes
    });
  }

}
