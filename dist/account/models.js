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
exports.Account = exports.getOrCreateUserForAccount = exports.getOrCreateFromUserRecord = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const accountSchema = new mongoose_1.Schema({
    uid: {
        type: String,
        match: /^\w{28}$/,
        index: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        match: /^\+\d{12}$/,
        index: true,
        unique: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
// Not using methods and statics because TypeScript has poor support
function getOrCreateFromUserRecord(userRecord) {
    return __awaiter(this, void 0, void 0, function* () {
        var account = yield exports.Account.findOne({ uid: userRecord.uid });
        if (account == null) {
            account = yield exports.Account.create({
                uid: userRecord.uid,
                phoneNumber: userRecord.phoneNumber,
            });
        }
        return account;
    });
}
exports.getOrCreateFromUserRecord = getOrCreateFromUserRecord;
;
// Not using methods and statics because TypeScript has poor support
function getOrCreateUserForAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield mongoose_1.default.model('User').findOne({ account: account });
        return user || (yield mongoose_1.default.model('User').create({ account: account }));
    });
}
exports.getOrCreateUserForAccount = getOrCreateUserForAccount;
exports.Account = mongoose_1.default.model('Account', accountSchema);
