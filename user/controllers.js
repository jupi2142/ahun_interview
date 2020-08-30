var {User, UserLink} = require('./models');

const FAKE_USER_ID = '5f4b4cbd610cc053f612a83b';

module.exports.get = async function(request, response) {
  var user = await User.findById(request.params.id);
  response.json(user);
};

module.exports.mine = async function(request, response) {
  // var userId = getLoggedInUser(request);
  var userId = FAKE_USER_ID;
  var user = await User.findById(userId);
  console.log('user: ', user);
  response.json(user);
};

module.exports.follow = async function(request, response) {
  var obj = {follower: FAKE_USER_ID, followed: request.params.id};
  var userLink = await UserLink.updateOne(obj, obj, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  response.send('You have successfully followed user.');
};

module.exports.unfollow = async function(request, response) {
  var obj = {follower: FAKE_USER_ID, followed: request.params.id};
  await UserLink.findOneAndDelete(obj);
  response.send('You have successfully unfollowed user.');
};
