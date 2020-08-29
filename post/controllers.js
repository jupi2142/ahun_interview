var {Post, Like} = require('./models');
var {User} = require('../user/models');
var bucket = require('../bucket');

const FAKE_USER_ID = '5f489535ba19eb2a37965fca';

module.exports.feed = async function(request, response) {
  // TODO: Dual purpose as mine?
  try {
    var limit = parseInt(request.query.limit) || 4;
    var page = parseInt(request.query.page) || 1;
    var skip = limit * (page - 1);
    var total = await Post.countDocuments({});
    var pages = Math.ceil(total / limit);

    var posts = await Post.find({})
      .populate('user')
      .skip(skip)
      .limit(limit);
    response.json({
      docs: posts,
      total,
      limit,
      pages,
      page,
    });
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
};

module.exports.mine = async function(request, response) {
  try {
    var filter = {user: FAKE_USER_ID};
    var limit = parseInt(request.query.limit) || 4;
    var page = parseInt(request.query.page) || 1;
    var skip = limit * (page - 1);
    var total = await Post.countDocuments(filter);
    var pages = Math.ceil(total / limit);

    var posts = await Post.find(filter)
      //.populate('user')
      .skip(skip)
      .limit(limit);
    response.json({
      docs: posts,
      total,
      limit,
      pages,
      page,
    });
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
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
      user.posts = await Post.countDocuments({user: user._id});
      user.save();
      response.json(post);
    } catch (e) {
      response.status(500).send(e);
    }
  });
};

module.exports.like = async function(request, response) {
  try {
    var post = await Post.findOne({_id: request.params.id});
    var obj = {post: request.params.id, user: FAKE_USER_ID};
    var like = await Like.update(obj, obj, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
    response.send('You have successfully liked this vibe');
  } catch (e) {
    response.status(500).send(e);
  }
};

module.exports.unlike = async function(request, response) {
  try {
    var post = await Post.findOne({_id: request.params.id});
    var obj = {post: request.params.id, user: FAKE_USER_ID};
    await Like.deleteOne(obj);
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
    response.send('You have successfully unliked this vibe');
  } catch (e) {
    response.status(500).send(e);
  }
};

module.exports.get = async function(request, response) {
  try {
    var post = await Post.findOne({_id: request.params.id}).populate('user');
    response.json(post);
  } catch (e) {
    response.status(500).send(error);
  }
};
