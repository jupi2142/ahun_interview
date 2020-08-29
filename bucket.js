var {Storage} = require('@google-cloud/storage');
var admin = require('firebase-admin');

var serviceAccountFile = `${__dirname}/real-service-account-file.json`

var gcsConfig = {
  bucket: "simple-feed-704cd.appspot.com",
  projectId: "simple-feed-704cd",
  acl: "publicread",
  contentType: (_, __) => "image/jpeg",
  keyFilename: serviceAccountFile
}

/* admin.initializeApp({
  credential: serviceAccountFile,
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
console.log(admin.Auth()) */

var storage = new Storage(gcsConfig);

module.exports = storage.bucket(gcsConfig.bucket);