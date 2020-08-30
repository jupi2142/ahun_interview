require('dotenv').config()

var express = require('express');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var multerGoogleStorage = require("multer-google-storage");
var multerMiddleware = multer({
  storage: multerGoogleStorage.storageEngine(),
});

var accountRoutes = require('./account/routes');
var userRoutes = require('./user/routes');
var postRoutes = require('./post/routes');

app.use(cors({origin: true}));
app.use(multerMiddleware.single('file'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/v1/accounts/', accountRoutes);
app.use('/v1/users/', userRoutes);
app.use('/v1/posts/', postRoutes);

app.listen(process.env.PORT);
