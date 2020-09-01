import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
import {Request, Response} from 'express';
import {User} from '../user/models';
import {
  Account,
  getOrCreateFromUserRecord,
  getOrCreateUserForAccount,
} from './models';

const serviceAccount = require(`${process.env.GCS_KEYFILE}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});
var auth = admin.auth();

export async function verify(request: any, response: Response): Promise<any> {
  try {
    var userRecord: any = await auth.getUserByPhoneNumber(
      request.body.phoneNumber,
    );
  } catch (e) {
    return response.status(401).send('Phone number has not been verified');
  }

  var account = await getOrCreateFromUserRecord(userRecord);
  var user = await getOrCreateUserForAccount(account);

  response.json(user);
}

export async function logout(
  request: Request,
  response: Response,
): Promise<any> {
  response.send('You have successfully logged out from your account');
}
