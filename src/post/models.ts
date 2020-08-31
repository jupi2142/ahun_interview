import mongoose, {Schema, Document} from 'mongoose';

interface IPost extends Document {
  likes?: number;
  caption: string;
  image: string;
  user: string; // Schema.Types.ObjectId,
  isLiked?: boolean;
}

const postSchema: Schema = new Schema(
  {
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

async function updatePostCount(post: IPost, next: Function) {
  var user = await mongoose.model('User').findOne({_id: post.user});
  if (user) {
    user.posts = await Post.countDocuments({user: post.user});
    user.save();
  }
  next();
}

postSchema.post('save', async function(post: IPost, next) {
  updatePostCount(post, next);
});
postSchema.post('deleteOne', {document: true, query: false}, function(
  next: Function,
) {
  updatePostCount(this, next);
});
postSchema.post('deleteOne', {document: false, query: true}, function(next: Function) {
  console.log('deleteOne this.getQuery(): ', this.getQuery());
});
postSchema.post('findOneAndDelete', function(next: Function) {
  console.log('findOneAndDelete this.getQuery(): ', this.getQuery());
});

export const Post = mongoose.model<IPost>('Post', postSchema);

interface ILike extends Document {
  user: string; // Schema.Types.ObjectId,
  post: string; // Schema.Types.ObjectId,
}

const likeSchema : Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      index: true,
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

async function updateLikesMiddleware(next: Function): Promise<any> {
  var query = this.getQuery();
  var post = await mongoose.model('Post').findById(query.post);
  if(post){
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
  }
}
likeSchema.post('updateOne', updateLikesMiddleware)
likeSchema.post('deleteOne', updateLikesMiddleware)

export const Like = mongoose.model<ILike>('Like', likeSchema);
