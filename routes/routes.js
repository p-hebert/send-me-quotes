'use strict';
const express = require('express');
const handlers = require('handlers/index');
const auth = require('../services/auth/index');

module.exports = (function() {

  var router = express.Router();

  router.post('/login', auth.login, handlers.session.login);

  router.get('/logout', auth.logout, handlers.session.logout);

  router.post('/register', auth.register, handlers.session.register);

  return router;

})();
