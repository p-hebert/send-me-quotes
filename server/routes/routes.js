'use strict';
const express = require('express');
const handlers = require('../handlers/index');
const auth = require('../services/auth/index');

module.exports = (function() {

  var router = express.Router();

  router.use(function(req, res, next){
    console.log(
     '\n'+
     `Host: ${req.headers.host}\n`+
     `Request: ${req.method} ${req.url}\n`+
     `Session User: ${req.session.user}\n`
    );
    next();
  });

  router.post('/u/login', auth.login, handlers.session.login);

  router.get('/u/logout', auth.logout, handlers.session.logout);

  router.post('/u/exists', auth.exists);

  router.post('/u/register', auth.register, handlers.session.register);

  return router;

})();
