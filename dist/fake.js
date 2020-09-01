"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.clean = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const lodash_1 = __importDefault(require("lodash"));
const faker_1 = __importDefault(require("faker"));
const models_1 = require("./account/models");
const models_2 = require("./user/models");
const models_3 = require("./post/models");
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(`${process.env.MONGO_DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
function clean() {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_2.User.deleteMany({});
        yield models_3.Post.deleteMany({});
        yield models_3.Like.deleteMany({});
        yield models_2.UserLink.deleteMany({});
    });
}
exports.clean = clean;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield clean();
        for (const userIndex of lodash_1.default.range(10)) {
            var account = yield models_1.Account.create({
                uid: faker_1.default.internet.password(28, false),
                phoneNumber: faker_1.default.phone.phoneNumber('+2519########'),
            });
            var name = faker_1.default.name.findName();
            var username = name.replace(/\W+/g, '-').toLowerCase();
            var user = yield models_2.User.create({
                account: account._id,
                name,
                username,
                profilePic: 'placeholder.jpeg',
                bio: faker_1.default.lorem.paragraph(),
            });
            console.log('user._id: ', user._id);
            for (const postIndex of lodash_1.default.range(30)) {
                var post = yield models_3.Post.create({
                    caption: faker_1.default.lorem.paragraph(),
                    image: 'placeholder.jpeg',
                    user: user._id,
                });
                console.log('\tpost._id: ', post._id);
            }
        }
        var users = yield models_2.User.find({});
        for (const follower of users) {
            for (const followed of users) {
                if (follower._id == followed._id) {
                    continue;
                }
                if (lodash_1.default.sample([true, false, false])) {
                    var obj = { follower: follower._id, followed: followed._id };
                    var userLink = yield models_2.UserLink.updateOne(obj, obj, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    });
                    console.log('userLink: ', userLink);
                }
            }
        }
        var posts = yield models_3.Post.find({});
        for (const user of users) {
            for (const post of posts) {
                if (lodash_1.default.sample([true, false, false])) {
                    var like = yield models_3.Like.updateOne({ post: post._id, user: user._id }, { post: post._id, user: user._id }, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    });
                    console.log('like: ', like);
                }
            }
        }
        console.log('FINISHED');
    });
}
exports.main = main;
