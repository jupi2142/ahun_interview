var express = require('express');
var router = express.Router();
var firebaseMiddleware = require('express-firebase-middleware');
const asyncHandler = require('express-async-handler');

var controllers = require('./controllers');

router.post('/verify', asyncHandler(controllers.verify));
router.use('/', firebaseMiddleware.auth);
router.post('/logout', asyncHandler(controllers.logout));

module.exports = router;
