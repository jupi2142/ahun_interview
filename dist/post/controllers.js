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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.unlike = exports.like = exports.create = exports.feed = void 0;
const models_1 = require("./models");
const models_2 = require("../user/models");
function feed(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (/\/mine/.test(request.url)
            ? { user: response.locals.user }
            : {});
        const limit = parseInt(request.query.limit) || 4;
        const page = parseInt(request.query.page) || 1;
        const skip = limit * (page - 1);
        const total = yield models_1.Post.countDocuments(filter);
        const pages = Math.ceil(total / limit);
        var posts = yield models_1.Post.find(filter)
            .populate('user')
            .skip(skip)
            .limit(limit);
        response.json({
            docs: posts,
            total,
            limit,
            pages,
            page,
        });
    });
}
exports.feed = feed;
function create(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield models_2.User.findById(response.locals.user);
        if (user) {
            var post = yield models_1.Post.create(Object.assign(Object.assign({}, request.body), { user: user._id, image: request.file.filename }));
            user.posts = (user.posts || 0) + 1;
            user.save();
            response.status(201).json(post);
        }
    });
}
exports.create = create;
function like(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var post = yield models_1.Post.findById(request.params.id);
        if (!post) {
            return response.status(404).send('Post not found');
        }
        response.locals.user.like(post);
        response.send('You have successfully liked this vibe');
    });
}
exports.like = like;
function unlike(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var post = yield models_1.Post.findById(request.params.id);
        if (!post) {
            return response.status(404).send('Post not found');
        }
        response.locals.user.unlike(post);
        response.send('You have successfully unliked this vibe');
    });
}
exports.unlike = unlike;
function get(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var post = yield models_1.Post.findById(request.params.id).populate('user');
        response.json(post);
    });
}
exports.get = get;
