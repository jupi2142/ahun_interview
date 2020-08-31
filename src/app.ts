import dotenv from 'dotenv';
dotenv.config();
import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import MulterGoogleStorage from 'multer-google-storage';
import accountRoutes from './account/routes';
import userRoutes from './user/routes';
import postRoutes from './post/routes';

mongoose
  .connect(`${process.env.MONGO_DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(_ => console.log('Mongo connected'))
  .catch(console.error);

const app: Application = express();
/* const multerMiddleware = multer({
  storage: MulterGoogleStorage.storageEngine(),
});
*/
const multerMiddleware = multer({dest: './public/images'});

app.use(cors({origin: true}));
app.use(multerMiddleware.single('file'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/v1/accounts/', accountRoutes);
app.use('/v1/users/', userRoutes);
app.use('/v1/posts/', postRoutes);

app.listen(`${process.env.PORT}`, _ => console.log('Server running'));
