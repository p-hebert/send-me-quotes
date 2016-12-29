const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const authenticate = require('./authenticate');

module.exports = {
  register: register,
  login: login,
  logout: logout,
  authenticate: authenticate,
};
