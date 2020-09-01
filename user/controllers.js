var {User, UserLink} = require('./models');

module.exports.get = async function(request, response) {
  var user = await User.findById(request.params.id);
  response.json(user);
};

module.exports.mine = async function(request, response) {
  response.json(response.locals.user);
};

module.exports.follow = async function(request, response) {
  var obj = {follower: response.locals.user, followed: request.params.id};
  var loggedInUser = response.locals.user;
  var targetUser = await User.findById(request.params.id);
  loggedInUser.follow(targetUser);
  response.send('You have successfully followed user.');
};

module.exports.unfollow = async function(request, response) {
  var obj = {follower: response.locals.user, followed: request.params.id};
  var loggedInUser = response.locals.user;
  var targetUser = await User.findById(request.params.id);
  loggedInUser.unfollow(targetUser);
  response.send('You have successfully unfollowed user.');
};
