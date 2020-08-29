var express = require('express')
var router = express.Router()

const asyncHandler = require('express-async-handler')

var controllers = require('./controllers');

router.get('/:id', asyncHandler(controllers.get));
router.get('/mine', asyncHandler(controllers.mine));
router.put('/follow/:id', asyncHandler(controllers.follow));
router.put('/unfollow/:id', asyncHandler(controllers.unfollow));

module.exports = router
