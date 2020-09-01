var {Post, Like} = require('./models');
var {User} = require('../user/models');

module.exports.feed = async function(request, response) {
  var filter = /\/mine/.test(request.url) ? {user: response.locals.user} : {};
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
  var post = await Post.create({
    ...request.body,
    user: response.locals.user._id,
    image: request.file.filename,
  });
  response.status(201).json(post);
};

module.exports.like = async function(request, response) {
  var post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).send('Post not found');
  }
  var obj = {post: request.params.id, user: response.locals.user};
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
    user: response.locals.user,
  });
  response.send('You have successfully unliked this vibe');
};

module.exports.get = async function(request, response) {
  var post = await Post.findById(request.params.id).populate('user');
  response.json(post);
};
