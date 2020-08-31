import {User, UserLink} from './models';
import {Request, Response} from 'express';

export async function get(request: Request, response: Response): Promise<any> {
  var user = await User.findById(request.params.id);
  response.json(user);
}

export async function mine(request: Request, response: Response): Promise<any> {
  var user = await User.findById(response.locals.user);
  response.json(user);
}

export async function follow(
  request: Request,
  response: Response,
): Promise<any> {
  var obj = {
    follower: response.locals.user,
    followed: request.params.id,
  };
  var userLink = await UserLink.updateOne(obj, obj, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  response.send('You have successfully followed user.');
}

export async function unfollow(
  request: Request,
  response: Response,
): Promise<any> {
  var obj = {
    follower: response.locals.user,
    followed: request.params.id,
  };
  await UserLink.findOneAndDelete(obj);
  response.send('You have successfully unfollowed user.');
}
