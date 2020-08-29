var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ahun', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, });
var {User, UserLink} = require('./user/models');
var {Post, UserLink} = require('./post/models');
Post.findOne({}).then(post => {
  // post.deleteOne().then(console.log).catch(console.error);
  Post.deleteOne({_id: post._id}).then(console.log).catch(console.error);
})
