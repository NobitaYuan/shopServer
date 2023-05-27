var express = require('express');
var router = express.Router();

// const insertAdmin = require('../db/test')

/* GET users listing. */
router.get('/', function(req, res, next) {
  // insertAdmin()
  res.send('respond with a resource');
});

module.exports = router;
