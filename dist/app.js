"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const routes_1 = __importDefault(require("./account/routes"));
const routes_2 = __importDefault(require("./user/routes"));
const routes_3 = __importDefault(require("./post/routes"));
mongoose_1.default
    .connect(`${process.env.MONGO_DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(_ => console.log('Mongo connected'))
    .catch(console.error);
const MulterGoogleStorage = require("multer-google-storage");
const app = express_1.default();
const multerMiddleware = multer_1.default({
    storage: MulterGoogleStorage.storageEngine(),
});
// const multerMiddleware = multer({dest: './public/images'});
app.use(cors_1.default({ origin: true }));
app.use(multerMiddleware.single('file'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/v1/accounts/', routes_1.default);
app.use('/v1/users/', routes_2.default);
app.use('/v1/posts/', routes_3.default);
app.listen(`${process.env.PORT}`, _ => console.log('Server running'));
