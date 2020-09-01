var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
  {
    posts: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      index: true,
      unique: true,
    },
    profilePic: {
      type: String,
    },
    bio: {
      type: String,
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

userSchema.methods.follow = async function(user) {
  var userLinkData = {follower: this._id, followed: user._id}
  var userLink = await UserLink.findOne(userLinkData);
  if(userLink == null){
    userLink = await UserLink.create(userLinkData)
    this.following += 1;
    this.save();

    user.followers += 1;
    user.save()
  }
}

userSchema.methods.unfollow = async function(user) {
  var userLinkData = {follower: this._id, followed: user._id}
  var results = await UserLink.deleteOne(userLinkData);
  if(results.n != 0){
    this.following -= 1;
    this.save();

    user.followers -= 1;
    user.save()
  }
}

userSchema.methods.like = async function(post) {
  var likeData = {post: post._id, user: this._id};
  var like = await this.model('Like').findOne(likeData);
  if(like == null){
    like = await Like.create(likeData)
    post.likes += 1;
    post.save()
  }
}

userSchema.methods.unlike = async function(post) {
  var likeData = {post: post._id, user: this._id};
  var results = await this.model('Like').deleteOne(likeData);
  if(results.n != 0){
    post.likes -= 1;
    post.save()
  }
}

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

var UserLink = mongoose.model('UserLink', userLinkSchema);
exports.UserLink = UserLink;
