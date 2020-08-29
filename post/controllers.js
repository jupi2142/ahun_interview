var {Post, Like} = require('./models');
var {User} = require('../user/models');
var bucket = require('../bucket');

const FAKE_USER_ID = '5f489535ba19eb2a37965fca';

module.exports.feed = async function(request, response) {
  var filter = /\/mine/.test(request.url) ? {user: FAKE_USER_ID} : {};
  var limit = parseInt(request.query.limit) || 4;
  var page = parseInt(request.query.page) || 1;
  var skip = limit * (page - 1);
  var total = await Post.countDocuments(filter);
  var pages = Math.ceil(total / limit);

  var posts = await Post.find(filter)
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
};

module.exports.create = async function(request, response) {
  var user = await User.findById(FAKE_USER_ID);
  var resources = await bucket.upload(request.file.path);
  var url = resources[0].metadata.mediaLink;
  var post = await Post.create({
    ...request.body,
    user: user._id,
    image: url,
  });
  response.status(201).json(post);
};

module.exports.like = async function(request, response) {
  var post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).send('Post not found');
  }
  var obj = {post: request.params.id, user: FAKE_USER_ID};
  var like = await Like.updateOne(obj, obj, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  response.send('You have successfully liked this vibe');
};

module.exports.unlike = async function(request, response) {
  var post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).send('Post not found');
  }
  await Like.deleteOne({
    post: request.params.id,
    user: FAKE_USER_ID,
  });
  response.send('You have successfully unliked this vibe');
};

module.exports.get = async function(request, response) {
  var post = await Post.findById(request.params.id).populate('user');
  response.json(post);
};
