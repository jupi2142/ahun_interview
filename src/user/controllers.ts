import {User, UserLink} from './models';
import {Request, Response} from 'express';

export async function get(request: Request, response: Response): Promise<any> {
  var user = await User.findById(request.params.id);
  response.json(user);
}

export async function mine(request: Request, response: Response): Promise<any> {
  response.json(response.locals.user);
}

export async function follow(
  request: Request,
  response: Response,
): Promise<any> {
  var loggedInUser = response.locals.user;
  var targetUser = await User.findById(request.params.id);
  loggedInUser.follow(targetUser);
  response.send('You have successfully followed user.');
}

export async function unfollow(
  request: Request,
  response: Response,
): Promise<any> {
  var loggedInUser = response.locals.user;
  var targetUser = await User.findById(request.params.id);
  loggedInUser.unfollow(targetUser);
  response.send('You have successfully unfollowed user.');
}
