var express = require('express');
var router = express.Router();
let indexController = require("../controller/IndexController");
module.exports = function (io) {
  router.get('/',indexController.getIndex);
  return router;
}