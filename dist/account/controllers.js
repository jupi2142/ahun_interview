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
exports.logout = exports.verify = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const models_1 = require("./models");
const serviceAccount = require(`${process.env.GCS_KEYFILE}`);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});
var auth = firebase_admin_1.default.auth();
function verify(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var userRecord = yield auth.getUserByPhoneNumber(request.body.phoneNumber);
        }
        catch (e) {
            return response.status(401).send('Phone number has not been verified');
        }
        var account = yield models_1.getOrCreateFromUserRecord(userRecord);
        var user = yield models_1.getOrCreateUserForAccount(account);
        response.json(user);
    });
}
exports.verify = verify;
function logout(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        response.send('You have successfully logged out from your account');
    });
}
exports.logout = logout;
