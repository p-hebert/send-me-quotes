const xss = require('../services/secure/xss');

module.exports = {
  register: register,
  login: login,
  logout: logout
}

function register(req, res) {
  res.json({user: xss(req.user)});
}

function login(req, res) {
  res.json({user: xss(req.user)});
}

function logout(req, res) {
  res.sendStatus(200);
}
