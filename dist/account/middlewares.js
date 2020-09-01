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
exports.auth = void 0;
require('dotenv').config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const models_1 = require("./models");
function auth(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var auth = firebase_admin_1.default.auth();
            var header = request.headers.authorization || '  ';
            if (header == undefined) {
                response.sendStatus(401);
                return;
            }
            var [_, token] = header.split(' ');
            var userRecord = yield auth.verifyIdToken(token);
            var account = yield models_1.getOrCreateFromUserRecord(userRecord);
            var user = yield models_1.getOrCreateUserForAccount(account);
            response.locals.user = user;
            next();
        }
        catch (e) {
            response.sendStatus(401);
        }
    });
}
exports.auth = auth;
;
