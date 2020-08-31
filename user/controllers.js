var {User, UserLink} = require('./models');

module.exports.get = async function(request, response) {
  var user = await User.findById(request.params.id);
  response.json(user);
};

module.exports.mine = async function(request, response) {
  // var userId = getLoggedInUser(request);
  var user = await User.findById(request.user);
  console.log('user: ', user);
  response.json(user);
};

module.exports.follow = async function(request, response) {
  var obj = {follower: request.user, followed: request.params.id};
  var userLink = await UserLink.updateOne(obj, obj, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  response.send('You have successfully followed user.');
};

module.exports.unfollow = async function(request, response) {
  var obj = {follower: request.user, followed: request.params.id};
  await UserLink.findOneAndDelete(obj);
  response.send('You have successfully unfollowed user.');
};
