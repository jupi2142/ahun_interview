var mongoose = require('mongoose');

var postSchema = new mongoose.Schema(
  {
    likes: {
      type: Number,
      required: true,
      default: 0
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
    },
    isLiked: {
      type: Boolean,
      // required: true
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

var Post = mongoose.model('Post', postSchema);

exports.Post = Post;

var likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}},
);

var Like = mongoose.model('Like', likeSchema);
exports.Like = Like;
