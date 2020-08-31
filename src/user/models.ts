import mongoose, {Schema, Document} from 'mongoose';

interface IUser extends Document {
  posts: number;
  followers: number;
  following: number;
  account: string; //mongoose.Schema.Types.ObjectId;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
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

async function updateFollowers(userLink: any, next: any) {
  var follower = await User.findById(userLink.follower);
  if(follower){
    follower.following = await UserLink.countDocuments({
      follower: userLink.follower,
    });
    follower.save();
  }

  var followed = await User.findById(userLink.followed);
  if(followed){
    followed.followers = await UserLink.countDocuments({
      followed: userLink.followed,
    });
    followed.save();
  }

  next();
}

for (const hook of ['updateOne', 'deleteOne', 'findOneAndDelete']) {
  userLinkSchema.post<IUserLink>(hook, async function(_: any, next: Function) {
    var query = this.getQuery();
    await updateFollowers(query, next);
  });
}

export var UserLink = mongoose.model<IUserLink>('UserLink', userLinkSchema);
