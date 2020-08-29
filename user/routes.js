var express = require('express')
var router = express.Router()

var controllers = require('./controllers');

router.get('/:id', controllers.get);
router.get('/mine', controllers.mine);
router.put('/follow/:id', controllers.follow);
router.put('/unfollow/:id', controllers.unfollow);

module.exports = router
