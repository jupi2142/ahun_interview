require('dotenv').config();

var lodash = require('lodash');
var faker = require('faker');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

var {Account} = require('./account/models');
var {User, UserLink} = require('./user/models');
var {Post, Like} = require('./post/models');

async function clean() {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Like.deleteMany({});
  await UserLink.deleteMany({});
}

async function main() {
  await clean();
  for (const userIndex of lodash.range(10)) {
    var account = await Account.create({});
    var name = faker.name.findName();
    var username = name.replace(/\W+/g, '-').toLowerCase();
    var user = await User.create({
      account: account._id,
      name,
      username,
      profilePic: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    });
    console.log('user._id: ', user._id);
    for (const postIndex of lodash.range(30)) {
      var post = await Post.create({
        caption: faker.lorem.paragraph(),
        image: faker.image.imageUrl(),
        user: user._id,
      });
      console.log('\tpost._id: ', post._id);
    }
  }

  var users = await User.find({});
  for (const follower of users) {
    for (const followed of users) {
      if (follower._id == followed._id) {
        continue;
      }
      if (lodash.sample([true, false, false])) {
        var obj = {follower: follower._id, followed: followed._id};
        var userLink = await UserLink.updateOne(obj, obj, {
          upsert: true,
          setDefaultsOnInsert: true,
        });
        console.log('userLink: ', userLink);
      }
    }
  }

  var posts = await Post.find({});
  for (const user of users) {
    for (const post of posts) {
      if (lodash.sample([true, false, false])) {
        var obj = {post: post._id, user: user._id};
        var like = await Like.updateOne(obj, obj, {
          upsert: true,
          setDefaultsOnInsert: true,
        });
        console.log('like: ', like);
      }
    }
  }

  console.log('FINISHED');
}

exports.main = main;
exports.clean = clean;
