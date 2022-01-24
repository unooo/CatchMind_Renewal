var express = require('express');
var router = express.Router();
let authController = require("../controller/AuthController");

module.exports = function (passport) {
  router.get('/register', authController.get_register);
  router.post('/register_process', authController.post_register);
  router.get('/login', authController.logIn);
  router.get('/logout', authController.logOut);
  router.post('/login_process', (req, res, next) => {
    authController.logIn_process(req, res, next, passport);
  }); 
  return router;
}

