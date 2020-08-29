var {User, UserLink} = require('./models');

const FAKE_USER_ID = '5f489535ba19eb2a37965fca';

module.exports.get = function(request, response) {
  var userId = request.params.id;
  User.findOne({_id: userId})
    .then(result => response.json(result))
    .catch(error => response.status(500).send(error));
};

module.exports.mine = function(request, response) {
  var userId = getLoggedInUser(request);
  User.findOne({_id: userId})
    .then(result => response.json(result))
    .catch(error => response.status(500).send(error));
};

module.exports.follow = function(request, response) {
  var obj = {follower: FAKE_USER_ID, followed: request.params.id};
  UserLink.updateOne(obj, obj, {upsert: true, setDefaultsOnInsert: true}).then(
    async userLink => {
      await User.findOneAndUpdate(
        {_id: obj.follower},
        {
          following: await UserLink.countDocuments({
            follower: obj.follower,
          }),
        },
      );
      await User.findOneAndUpdate(
        {_id: obj.followed},
        {
          followers: await UserLink.countDocuments({
            followed: obj.followed,
          }),
        },
      );
      response.send("You have successfully followed user.")
    },
  );
};

module.exports.unfollow = function(request, response) {;
  var obj = {follower: FAKE_USER_ID, followed: request.params.id};
  UserLink.findOneAndDelete(obj).then(
    async userLink => {
      await User.findOneAndUpdate(
        {_id: obj.follower},
        {
          following: await UserLink.countDocuments({
            follower: obj.follower,
          }),
        },
      );
      await User.findOneAndUpdate(
        {_id: obj.followed},
        {
          followers: await UserLink.countDocuments({
            followed: obj.followed,
          }),
        },
      );
      response.send("You have successfully unfollowed user.")
    },
  );
};
