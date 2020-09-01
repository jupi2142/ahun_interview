require('dotenv').config();

var {Account} = require('./models.js');
var {User} = require('../user/models.js');
var admin = require.main.require('firebase-admin');

module.exports.auth = async function(request, response, next) {
  try {
    var auth = admin.auth();
    var [_, token] = request.headers.authorization.split(' ');
    var userRecord = await auth.verifyIdToken(token);
    var account = await Account.findOne({uid: userRecord.uid});
    account = account || (await Account.create(userRecord));
    var user = await User.findOne({account});
    user = user || (await User.create({account: account._id}));
    response.locals.user = user;
    next();
  } catch (e) {
    response.sendStatus(401);
  }
};
