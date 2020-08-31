require('dotenv').config();
var admin = require('firebase-admin');
var serviceAccount = require(process.env.GCS_KEYFILE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});
var auth = admin.auth();

exports.auth = auth
