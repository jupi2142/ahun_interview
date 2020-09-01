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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postSchema = new mongoose_1.Schema({
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.Post = mongoose_1.default.model('Post', postSchema);
const likeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Post',
        index: true,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.Like = mongoose_1.default.model('Like', likeSchema);
