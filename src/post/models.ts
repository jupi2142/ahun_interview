import mongoose, {Schema, Document} from 'mongoose';

export interface IPost extends Document {
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

export const Like = mongoose.model<ILike>('Like', likeSchema);
