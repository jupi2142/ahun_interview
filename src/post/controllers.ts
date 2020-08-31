import {Post, Like} from './models';
import {User} from '../user/models';
import {Request, Response} from 'express';

export async function feed(request: Request, response: Response): Promise<any> {
  const filter = (
    /\/mine/.test(request.url)
        ? {user: response.locals.user}
        : {});
  const limit: number = parseInt(<string>request.query.limit) || 4;
  const page = parseInt(<string>request.query.page) || 1;
  const skip = limit * (page - 1);
  const total = await Post.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  var posts = await Post.find(filter)
    .populate('user')
    .skip(skip)
    .limit(limit);
  response.json({
    docs: posts,
    total,
    limit,
    pages,
    page,
  });
}

export async function create(
  request: Request,
  response: Response,
): Promise<any> {
  var user = await User.findById(response.locals.user);
  if (user) {
    var post = await Post.create({
      ...request.body,
      user: user._id,
      image: request.file.filename,
    });
    response.status(201).json(post);
  }
}

export async function like(request: Request, response: Response): Promise<any> {
  var post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).send('Post not found');
  }
  var obj = {post: request.params.id, user: response.locals.user};
  var like = await Like.updateOne(obj, obj, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  response.send('You have successfully liked this vibe');
}

export async function unlike(
  request: Request,
  response: Response,
): Promise<any> {
  var post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).send('Post not found');
  }
  await Like.deleteOne({
    post: request.params.id,
    user: response.locals.user,
  });
  response.send('You have successfully unliked this vibe');
}

export async function get(request: Request, response: Response): Promise<any> {
  var post = await Post.findById(request.params.id).populate('user');
  response.json(post);
}
