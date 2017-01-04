const xss = require('../services/secure/xss');
const filter = require('../utilities/filter');
const catcher = require('../utilities/catcher');

module.exports = {
  register: register,
  login: login,
  logout: logout
};

function register(req, res) {
  res.sendStatus(200);
}

function login(req, res) {
  filter.user(req.user, true) 
  .then((user) => {
    res.json({user: xss(user)});
  })
  .catch(catcher(res));
}

function logout(req, res) {
  res.sendStatus(200);
}
