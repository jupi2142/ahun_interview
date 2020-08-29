var express = require('express');
var router = express.Router();

var controllers = require('./controllers.js');

router.get('/verify', controllers.verify);
router.post('/logout', controllers.logout);

module.exports = router;
