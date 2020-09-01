var express = require('express');
var router = express.Router();

const asyncHandler = require('express-async-handler');

var controllers = require('./controllers');
var firebaseMiddleware = require('../account/middlewares.js');

router.use('/', firebaseMiddleware.auth);

router.get(['/', '/mine/'], asyncHandler(controllers.feed));
router.get('/:id', asyncHandler(controllers.get));

router.post('/', asyncHandler(controllers.create));
router.put('/like/:id/', asyncHandler(controllers.like));
router.put('/unlike/:id/', asyncHandler(controllers.unlike));

module.exports = router;
