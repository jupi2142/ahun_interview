var express = require('express');
var router = express.Router();

var controllers = require('./controllers.js');

router.get('/', controllers.feed);
router.get('/mine/', controllers.mine);
router.get('/:id', controllers.get);

router.post('/', controllers.create);
router.put('/like/:id/', controllers.like);
router.put('/unlike/:id/', controllers.unlike);

module.exports = router;
