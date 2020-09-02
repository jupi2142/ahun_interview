import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import * as controllers from './controllers';

import * as firebaseMiddleware from '../account/middlewares';

const router = Router();

router.use('/', firebaseMiddleware.auth);
router.get('/mine', asyncHandler(controllers.mine));
router.get('/:id', asyncHandler(controllers.get));
router.put('/follow/:id', asyncHandler(controllers.follow));
router.put('/unfollow/:id', asyncHandler(controllers.unfollow));

export default router;
