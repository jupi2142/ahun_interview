import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import * as controllers from './controllers';

import * as firebaseMiddleware from './middlewares';

const router = Router();

router.post('/verify', asyncHandler(controllers.verify));
router.use('/', firebaseMiddleware.auth);
router.post('/logout', asyncHandler(controllers.logout));

export default router
