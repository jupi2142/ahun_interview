var mongoose = require('mongoose');

var postSchema = new mongoose.Schema(
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
      // required: true
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

async function updatePostCount(post, next) {
  var user = await mongoose.model('User').findOne({_id: post.user});
  user.posts = await Post.countDocuments({user: post.user});
  user.save();
  next();
}

postSchema.post('save', async function(post, next) {
  updatePostCount(post, next);
});
postSchema.post('deleteOne', {document: true, query: false}, function(next) {
  updatePostCount(this, next);
});
postSchema.post('deleteOne', {document: false, query: true}, function(next) {
  console.log('deleteOne this.getQuery(): ', this.getQuery());
});
postSchema.post('findOneAndDelete', function(next) {
  console.log('findOneAndDelete this.getQuery(): ', this.getQuery());
});

var Post = mongoose.model('Post', postSchema);

exports.Post = Post;

var likeSchema = new mongoose.Schema(
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

for (const hook of ['updateOne', 'deleteOne']) {
  likeSchema.post(hook, async function(next) {
    var query = this.getQuery();
    var post = await mongoose.model('Post').findById(query.post);
    post.likes = await Like.countDocuments({post: post._id});
    await post.save();
  });
}

var Like = mongoose.model('Like', likeSchema);
exports.Like = Like;
