var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ahun', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var multerMiddleware = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, '/tmp');
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    },
  }),
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

app.listen(8900);
