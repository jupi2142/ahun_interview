var express = require('express');
var router = express.Router();

const asyncHandler = require('express-async-handler');

var controllers = require('./controllers');

router.get('/verify', asyncHandler(controllers.verify));
router.post('/logout', asyncHandler(controllers.logout));

module.exports = router;
