import mongoose, {Schema, Document} from 'mongoose';
import {IPost} from '../post/models';

interface IUser extends Document {
  posts?: number;
  followers?: number;
  following?: number;
  account: string; //mongoose.Schema.Types.ObjectId;
  name?: string;
  username?: string;
  profilePic?: string;
  bio?: string;
}

interface IUserLink extends Document {
  follower: string;
  followed: string;
}

const userSchema: Schema = new Schema(
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

userSchema.methods.follow = async function(user: IUser) {
  var userLinkData = {follower: this._id, followed: user._id};
  var userLink = await UserLink.findOne(userLinkData);
  if (userLink == null) {
    userLink = await UserLink.create(userLinkData);
    this.following += 1;
    this.save();

    if (user.followers == undefined) {
      user.followers = 0;
    }
    user.followers += 1;
    user.save();
  }
};

userSchema.methods.unfollow = async function(user: IUser) {
  var userLinkData = {follower: this._id, followed: user._id};
  var results = await UserLink.deleteOne(userLinkData);
  if (results.n != 0) {
    this.following -= 1;
    this.save();

    if (user.followers == undefined) {
      user.followers = 0;
    }
    user.followers -= 1;
    user.save();
  }
};

userSchema.methods.like = async function(post: IPost) {
  var likeData = {post: post._id, user: this._id};
  var like = await this.model('Like').findOne(likeData);
  if (like == null) {
    like = await this.model('Like').create(likeData);
    if (post.likes == undefined) {
      post.likes = 0;
    }
    post.likes += 1;
    post.save();
  }
};

userSchema.methods.unlike = async function(post: IPost) {
  var likeData = {post: post._id, user: this._id};
  var results = await this.model('Like').deleteOne(likeData);
  if (results.n != 0) {
    if (post.likes == undefined) {
      post.likes = 0;
    }
    post.likes -= 1;
    post.save();
  }
};

export const User = mongoose.model<IUser>('User', userSchema);

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

export const UserLink = mongoose.model<IUserLink>('UserLink', userLinkSchema);
