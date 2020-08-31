import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import * as controllers from './controllers';

var firebaseMiddleware = require('express-firebase-middleware');

const router = Router();

router.get('/:id', asyncHandler(controllers.get));

router.use('/', firebaseMiddleware.auth);
router.get('/mine', asyncHandler(controllers.mine));
router.put('/follow/:id', asyncHandler(controllers.follow));
router.put('/unfollow/:id', asyncHandler(controllers.unfollow));

export default router;
