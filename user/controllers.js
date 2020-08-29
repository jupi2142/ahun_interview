var {User, UserLink} = require('./models');

const FAKE_USER_ID = '5f489535ba19eb2a37965fca';

module.exports.get = async function(request, response) {
  try {
    var user = await User.findById(request.params.id);
    response.json(user);
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
};

module.exports.mine = async function(request, response) {
  try {
    var userId = getLoggedInUser(request);
    var user = await User.findById(userId);
    response.json(user);
  } catch (e) {
    console.error(e);
    response.status(500).send(e);
  }
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
