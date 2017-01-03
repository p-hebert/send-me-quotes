
module.exports = {
  user: filter_user
}

function filter_user(user){
  return {
    username: user.username,
    email: user.email,
    country: user.country,
    sets: user.sets,
    notes: user.notes
  };
}
