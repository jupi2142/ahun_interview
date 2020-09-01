import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import * as controllers from './controllers';

import * as firebaseMiddleware from '../account/middlewares';

const router = Router();

router.use('/', firebaseMiddleware.auth);

router.get(['/', '/mine/'], asyncHandler(controllers.feed));
router.get('/:id', asyncHandler(controllers.get));

router.post('/', asyncHandler(controllers.create));
router.put('/like/:id/', asyncHandler(controllers.like));
router.put('/unlike/:id/', asyncHandler(controllers.unlike));

export default router;
