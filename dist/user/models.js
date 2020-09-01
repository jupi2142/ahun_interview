"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLink = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    posts: {
        type: Number,
        default: 0,
    },
    followers: {
        type: Number,
        default: 0,
    },
    following: {
        type: Number,
        default: 0,
    },
    account: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        index: true,
        unique: true,
    },
    profilePic: {
        type: String,
    },
    bio: {
        type: String,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
userSchema.methods.follow = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        var userLinkData = { follower: this._id, followed: user._id };
        var userLink = yield exports.UserLink.findOne(userLinkData);
        if (userLink == null) {
            userLink = yield exports.UserLink.create(userLinkData);
            this.following += 1;
            this.save();
            if (user.followers == undefined) {
                user.followers = 0;
            }
            user.followers += 1;
            user.save();
        }
    });
};
userSchema.methods.unfollow = function (user) {
    return __awaiter(this, void 0, void 0, function* () {
        var userLinkData = { follower: this._id, followed: user._id };
        var results = yield exports.UserLink.deleteOne(userLinkData);
        if (results.n != 0) {
            this.following -= 1;
            this.save();
            if (user.followers == undefined) {
                user.followers = 0;
            }
            user.followers -= 1;
            user.save();
        }
    });
};
userSchema.methods.like = function (post) {
    return __awaiter(this, void 0, void 0, function* () {
        var likeData = { post: post._id, user: this._id };
        var like = yield this.model('Like').findOne(likeData);
        if (like == null) {
            like = yield this.model('Like').create(likeData);
            if (post.likes == undefined) {
                post.likes = 0;
            }
            post.likes += 1;
            post.save();
        }
    });
};
userSchema.methods.unlike = function (post) {
    return __awaiter(this, void 0, void 0, function* () {
        var likeData = { post: post._id, user: this._id };
        var results = yield this.model('Like').deleteOne(likeData);
        if (results.n != 0) {
            if (post.likes == undefined) {
                post.likes = 0;
            }
            post.likes -= 1;
            post.save();
        }
    });
};
exports.User = mongoose_1.default.model('User', userSchema);
var userLinkSchema = new mongoose_1.default.Schema({
    follower: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    followed: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.UserLink = mongoose_1.default.model('UserLink', userLinkSchema);
