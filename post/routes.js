var express = require('express');
var router = express.Router();

var controllers = require('./controllers');

router.get(['/', '/mine/'], controllers.feed);
router.get('/:id', controllers.get);

router.post('/', controllers.create);
router.put('/like/:id/', controllers.like);
router.put('/unlike/:id/', controllers.unlike);

module.exports = router;
