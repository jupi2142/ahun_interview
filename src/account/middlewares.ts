require('dotenv').config();

import {Request, Response, NextFunction} from 'express';

import admin from 'firebase-admin';
import {
  Account,
  getOrCreateFromUserRecord,
  getOrCreateUserForAccount,
} from './models';
import {User} from '../user/models';

export async function auth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    var auth = admin.auth();
    var header = request.headers.authorization || '  ';
    if (header == undefined) {
      response.sendStatus(401);
      return;
    }
    var [_, token] = header.split(' ');
    var userRecord = await auth.verifyIdToken(token);
    var account = await getOrCreateFromUserRecord(userRecord);
    var user = await getOrCreateUserForAccount(account);
    response.locals.user = user;
    next();
  } catch (e) {
    response.sendStatus(401);
  }
};
