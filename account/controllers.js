require('dotenv').config();
var admin = require('firebase-admin');
var serviceAccount = require(process.env.GCS_KEYFILE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});
var auth = admin.auth();
var {User} = require('../user/models');
var {Account} = require('../account/models');

module.exports.verify = async function(request, response) {
  try {
    var userRecord = await auth.getUserByPhoneNumber(request.body.phoneNumber);
  } catch (e) {
    return response.status(401).send('Phone number has not been verified');
  }
  var account = await Account.findOne({uid: userRecord.uid});
  account = account || await Account.create(userRecord)

  var user = await User.findOne({account})
  user = user || await User.create({account: account._id})

  response.json(user);
};

module.exports.logout = function(request, response) {
  response.send('You have successfully logged out from your account');
};
