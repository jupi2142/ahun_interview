var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
  {
    posts: {
      type: Number,
      default: 0,
      // required: true,
    },
    followers: {
      type: Number,
      default: 0,
      // required: true,
    },
    following: {
      type: Number,
      default: 0,
      // required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      // required: true,
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

var User = mongoose.model('User', userSchema);
exports.User = User;

var userLinkSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    followed: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

async function updateFollowers(userLink, next) {
  var follower = await User.findById(userLink.follower);
  follower.following = await UserLink.countDocuments({
    follower: userLink.follower,
  });
  follower.save();

  var followed = await User.findById(userLink.followed);
  followed.followers = await UserLink.countDocuments({
    followed: userLink.followed,
  });
  followed.save();

  next();
}

for (const hook of ['updateOne', 'deleteOne', 'findOneAndDelete']) {
  userLinkSchema.post(hook, async function(_, next) {
    var query = this.getQuery();
    await updateFollowers(query, next);
  });
}

var UserLink = mongoose.model('UserLink', userLinkSchema);
exports.UserLink = UserLink;
