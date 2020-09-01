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
exports.unfollow = exports.follow = exports.mine = exports.get = void 0;
const models_1 = require("./models");
function get(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield models_1.User.findById(request.params.id);
        response.json(user);
    });
}
exports.get = get;
function mine(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        response.json(response.locals.user);
    });
}
exports.mine = mine;
function follow(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var loggedInUser = response.locals.user;
        var targetUser = yield models_1.User.findById(request.params.id);
        loggedInUser.follow(targetUser);
        response.send('You have successfully followed user.');
    });
}
exports.follow = follow;
function unfollow(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var loggedInUser = response.locals.user;
        var targetUser = yield models_1.User.findById(request.params.id);
        loggedInUser.unfollow(targetUser);
        response.send('You have successfully unfollowed user.');
    });
}
exports.unfollow = unfollow;
