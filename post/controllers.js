var {Post, Like} = require('./models');
var {User} = require('../user/models');
var bucket = require('../bucket');

const FAKE_USER_ID = '5f489535ba19eb2a37965fca';

module.exports.feed = function(request, response) {
  Post.find({})
    .populate('user')
    .then(response.json.bind(response))
    .catch(console.error);
};

module.exports.mine = function(request, response) {
  Post.find({user: FAKE_USER_ID})
    .populate('user')
    .then(posts => response.json(posts))
    .catch(console.error);
};

module.exports.create = function(request, response) {
  User.findOne({_id: FAKE_USER_ID}).then(async user => {
    if (!user) {
      response.status(403).send('User not found');
    }
    try {
      var resources = await bucket.upload(request.file.path);
      var url = resources[0].metadata.mediaLink;
      request.body.user = user._id;
      request.body.image = url;
      var post = await Post.create(request.body);
      var user = await User.findOne({_id: post.user});
      post.user = user;
      user.posts = await Post.countDocuments({user: user._id})
      user.save()
      response.json(post);
    } catch (e) {
      response.status(500).send(e);
    }
  });
};

module.exports.like = function(request, response) {
  (async function() {
    var post = await Post.findOne({_id: request.params.id});
    var obj = {post: request.params.id, user: FAKE_USER_ID};
    var like = await Like.update(obj, obj, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
    response.send("You have successfully liked this vibe");
  })();
};

module.exports.unlike = function(request, response) {
  (async function() {
    var post = await Post.findOne({_id: request.params.id});
    var obj = {post: request.params.id, user: FAKE_USER_ID};
    await Like.deleteOne(obj);
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
    response.send("You have successfully unliked this vibe");
  })();
};

module.exports.get = function(request, response) {
  Post.findOne({_id: request.params.id})
    .populate('user')
    .then(post => response.json(post))
    .catch(error => response.status(500).send(error));
};
